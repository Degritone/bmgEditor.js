{
  let fixText = function(textbox){
    for(let t of Array.from(textbox.querySelectorAll("tag"))){
      if(!t.querySelector("tag"))
        continue;
      let ot = t.outerHTML.split("<tag").slice(1).map(l=>l.replaceAll("</tag>",""));
      t.outerHTML = `<tag${ot.join("</tag><tag")}</tag>`;
    }
    for(let t of Array.from(textbox.querySelectorAll("tag"))){
      if(!t.querySelector("br"))
        continue;
      let ot = t.outerHTML.split("<br>");
      let ti = ot[0].match(/<tag(.+?) control=".+?" system=".+?">/)[1];
      t.outerHTML = ot.join(`</tag><br><tag${ti} control="-1" system="-1">`);
    }
    for(let t of Array.from(textbox.querySelectorAll("tag"))){
      if(!t.innerHTML.replaceAll("\r","").replaceAll("\n","").replaceAll(" ","")){
        t.remove();
        continue;
      }
      t.style.cssText = `
        letter-spacing:${parseInt(t.getAttribute("spacing"))/42*8.796875}px;
        font-size:${16*parseInt(t.getAttribute("size"))/100}px;
        line-height${19*parseInt(t.getAttribute("lineHeight"))/42}px;
        transform:scale(${parseInt(t.getAttribute("width"))/100},${parseInt(t.getAttribute("height"))/100});
      `;
    }
    for(let b of Array.from(textbox.querySelectorAll("br")))
      if(!b.nextSibling || b.nextSibling.tagName=="BR")
        b.remove();
    for(let s of Array.from(textbox.querySelectorAll("span")))
      if(s.innerHTML=="▼")
        s.outerHTML = "<pause>▼</pause>";
    for(let s of Array.from(textbox.querySelectorAll("span")))
      if(s.children.length)
        for(let c of Array.from(s.children))
          s.parentNode.insertBefore(c,s.nextSibling);
  }
  
  let Editor = function(parentNode){
    if(this==window)
      throw new Error(`BMG${typeof(BMG)!=typeof(undefined)?".":""}Editor must be constructed with new BMG${typeof(BMG)!=typeof(undefined)?".":""}Editor`);
    parentNode = parentNode?parentNode:document.body;
    this.editor = document.createElement("editor");
    parentNode.appendChild(this.editor);
    this.editor.innerHTML = `
<center>
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;">A<div style="display:inline-block;margin-left:-3px;font-size:10px;">A</div></center><input type="text" value="100" id="size" oninput="updateSize(this)" style="width:40px;"></input></div>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;"><span class="bottom15 top15"><span>A</span></span><span class="bottom15 top16"><span>A</span></span></center><input type="text" value="0" id="colorTop" oninput="updateColor()" style="width:30px;"></input></div>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;"><span class="bottom15 top15"><span>A</span></span><span class="bottom16 top15"><span>A</span></span></center><input type="text" value="0" id="colorBottom" oninput="updateColor()" style="width:30px;"></input></div>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;">&gt;&gt;</center><input type="text" value="11" id="speed" oninput="updateSpeed(this)" style="width:30px;"></input></div>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;"><div style="transform:scaleY(0.5);display:inline-block;">A</div><div style="transform:scaleY(1.3);display:inline-block;">A</div></center><input type="text" value="100" id="height" oninput="updateHeight(this)" style="width:30px;"></input></div>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;"><div style="transform:scaleX(0.5);display:inline-block;margin-left:-3px;">A</div><div style="transform:scaleX(1.3);display:inline-block;">A</div></center><input type="text" value="100" id="width" oninput="updateWidth(this)" style="width:30px;"></input></div><br>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:40;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;position:relative;top:-1px;"><div style="display:inline-block;font-size:12px;">A&lt;-&gt;A</div></center><input type="text" value="0" id="spacing" oninput="updateSpacing(this)" style="width:30px;"></input></div>
  
  <div style="display:inline-block;"><center style="display:inline-block;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;position:relative;top:-2px;"><div style="display:inline-block;font-size:10px;line-height:3px;position:relative;top:5px;left:-4px;">^<br>|<br>v<br>&nbsp;&nbsp;A</div></center><input type="text" value="42" id="lineHeight" oninput="updateLineHeight(this)" style="width:30px;"></input></div>
  
  <center style="display:inline-block;cursor:pointer;font-weight:bold;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;" onpointerdown="insertPause(event)">||</center>
  
  <center style="display:inline-block;cursor:pointer;width:20;height:20;color:#000000;background:#EEEEEE;border-radius:2px;line-height:20px;position:relative;top:-1px;" onpointerdown="showButtonPicker(event)" id="BMGEditorButtonPickerButton">
    <div style="position:absolute;bottom:calc(100% - 2px);left:0px;cursor:default;padding:3px;border-radius:5px 5px 5px 0px;width:100px;height:115px;background:#EEEEEE;" id="BMGEditorButtonPicker">
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton0" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton1" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton3" onpointerdown="insertButton(event,this)"></img><br>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton4" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton6" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton7" onpointerdown="insertButton(event,this)"></img><br>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton5" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton9" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton2" onpointerdown="insertButton(event,this)"></img><br>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton8" onpointerdown="insertButton(event,this)"></img>
      <img style="display:inline-block;width:24px;height:24px;cursor:pointer;" id="BMGEditorButton10" onpointerdown="insertButton(event,this)"></img>
    </div>
  </center>
</center>`;
    
    for(let e of Array.from(this.editor.querySelectorAll("*"))){
      let t;
      if(t=e.getAttribute("onpointerdown")){
        let f = t.split("(")[0];
        e.addEventListener("pointerdown",v=>this[f](v,e));
      }
      if(t=e.getAttribute("onchange")){
        let f = t.split("(")[0];
        e.addEventListener("change",v=>this[f](v,e));
      }
      if(t=e.getAttribute("oninput")){
        let f = t.split("(")[0];
        e.addEventListener("input",v=>this[f](v,e));
      }
      e.removeAttribute("onpointerdown");
      e.removeAttribute("onchange");
      e.removeAttribute("oninput");
      if(e.id=="BMGEditorButtonPickerButton"){
        let i = Math.round(Math.random()*10);
        if(buttonIcons[i].src)
          e.appendChild(buttonIcons[i].cloneNode());
        else if(buttonIcons[0].src)
          e.appendChild(buttonIcons[0].cloneNode());
        continue;
      }
      let imgID;
      if(!(imgID=e.id.match(/\d+/)))
        continue;
      imgID = parseInt(imgID[0]);
      if(e.tagName!="IMG" || !buttonIcons[imgID].src)
        continue;
      e.src = buttonIcons[imgID].src;
    }
    
    document.body.addEventListener("pointerdown",e=>{
      if(e.button!=0)
        return;
      this.editor.querySelector("#BMGEditorButtonPicker").style.display = "none";
    });
    
    this.textbox = document.createElement("editing");
    this.editor.appendChild(this.textbox);
    this.textbox.setAttribute("contenteditable",true);
    
    document.addEventListener("pointerdown",()=>{
      if(!getSelection().rangeCount)
        return;
      this.range = getSelection().getRangeAt(0);
      setTimeout(()=>this.setControlValues(false),1);
      this.setHighlight();
    });
    this.textbox.addEventListener("focusin",()=>{
      for(let t of Array.from(this.textbox.querySelectorAll(".nut")))
        t.classList.remove("nut");
      if(this.textbox.highlight)
        this.textbox.highlight.remove();
    });
    this.textbox.addEventListener("pointerdown",e=>{
      e.stopPropagation();
      setTimeout(()=>this.setControlValues(),1);
    });
    this.textbox.addEventListener("keyup",e=>{
      if(e.key=="Enter"){
        this.textbox.innerHTML = this.textbox.innerHTML
          .replaceAll(/<\/p><p(.|\r|\n)+?>/g,"<br>")
        ;
        fixText(this.textbox);
        if(this.original)
          this.original.innerHTML = this.textbox.children[0].innerHTML;
      }
      setTimeout(()=>this.setControlValues(),1);
    });
    this.textbox.addEventListener("keydown",e=>{
      if(e.key!="ArrowDown" && e.key!="ArrowUp")
        return;
      let characters = Array.from(this.textbox.querySelectorAll("span,br,pause"));
      let tagNames = characters.map(t=>t.tagName);
      let lines = [];
      let current = [];
      let s = getSelection();
      let linePosition;
      let lineNumber;
      for(let i=0;i<characters.length;i++){
        if(tagNames[i]=="BR"){
          lines.push(current);
          current = [];
          continue;
        }
        current.push(characters[i]);
        if(s.focusNode==characters[i].childNodes[0]){
          linePosition = current.length;
          lineNumber = lines.length;
          if(e.key=="ArrowUp" && lineNumber==0)
            return;
        }
      }
      if(linePosition===undefined)
        return;
      let down = e.key=="ArrowDown";
      if(down && lineNumber==lines.length-1)
        return;
      let o = down?1:-1;
      let max = lines[lineNumber+o].length-1;
      if(max==-1)
        return;
      if(linePosition>max)
        linePosition = max;
      let leftStart = s.focusNode==this.range.startContainer;
      let shouldCollapse = !e.shiftKey;
      let l = lines[lineNumber+o][linePosition-1].childNodes[0];
      let b = this.range[`${leftStart?"end":"start"}Container`];
      setTimeout(()=>{
        getSelection().setBaseAndExtent(shouldCollapse?l:b,1,l,1);
        setTimeout(()=>this.range = getSelection().getRangeAt(0));
      },1);
    });
    this.textbox.addEventListener("input",e=>{
      if(e.data){
        let anc = getSelection().getRangeAt(0).commonAncestorContainer;
        let nt = "<span style='-webkit-text-fill-color:transparent;color:#000000;'>"+anc.textContent.split("").map(c=>c==" "?"&nbsp;":c).join("</span><span style='-webkit-text-fill-color:transparent;color:#000000;'>")+"</span>";
        anc.parentNode.outerHTML = nt;
        getSelection().modify("move","right","character");
        getSelection().modify("move","right","character");
      }
      if(this.original){
        this.original.innerHTML = this.textbox.children[0].innerHTML;
        this.original.textSpans = null;
        this.original.textObject = null;
      }
      fixText(this.textbox);
      this.textbox.textSpans = null;
    });
  };
  Editor.prototype.surround = function({speed=-1,color=[-1,-1],size=-1,spacing=-1,lineHeight=-1,height=-1,width=-1}={}){
    let ancestorTag = this.range.commonAncestorContainer;
    let isNew = {
      speed:speed!=-1,
      color:color[0]!=-1||color[1]!=-1,
      size:size!=-1,
      spacing:spacing!=-1,
      lineHeight:lineHeight!=-1,
      height:height!=-1,
      width:width!=-1
    }
    while(ancestorTag.tagName!="P" && ancestorTag.tagName!="TAG")
      ancestorTag = ancestorTag.parentNode;
    if(color[0]==-1)
      color[0] = ancestorTag.getAttribute("colorTop");
    if(color[0]==0)
      color[0] = 2;
    if(color[1]==-1)
      color[1] = ancestorTag.getAttribute("colorBottom");
    if(color[1]==0)
      color[1] = (color[0]%255)+1;
    if(speed==-1)
      speed = ancestorTag.getAttribute("speed");
    if(size==-1)
      size = ancestorTag.getAttribute("size");
    if(spacing==-1)
      spacing = ancestorTag.getAttribute("spacing");
    if(lineHeight==-1)
      lineHeight = ancestorTag.getAttribute("lineHeight");
    if(height==-1)
      height = ancestorTag.getAttribute("height");
    if(width==-1)
      width = ancestorTag.getAttribute("width");
    let nuts = this.textbox.querySelectorAll(".nut");
    if(nuts.length){
      for(let n of nuts){
        for(let c of Array.from(n.classList))
          n.classList.remove(c);
        n.classList.add(`top${color[0]}`);
        n.classList.add(`bottom${color[1]}`);
        n.classList.add("nut");
        n.setAttribute("colorTop",color[0]);
        n.setAttribute("colorBottom",color[1]);
        n.setAttribute("spacing",spacing);
        n.setAttribute("lineHeight",lineHeight);
        n.setAttribute("height",height);
        n.setAttribute("width",width);
        n.setAttribute("size",size);
        n.setAttribute("speed",speed);
        n.setAttribute("control",-1);
        n.setAttribute("system",-1);
      }
      fixText(this.textbox);
      if(this.original)
        this.original.innerHTML = this.textbox.children[0].innerHTML;
      if(this.textbox.highlight){
        this.textbox.highlight.remove();
        this.setHighlight();
      }
      return;
    }
    let newTag = document.createElement("tag");
    newTag.classList.add(`top${color[0]}`);
    newTag.classList.add(`bottom${color[1]}`);
    newTag.classList.add("nut");
    newTag.setAttribute("colorTop",color[0]);
    newTag.setAttribute("colorBottom",color[1]);
    newTag.setAttribute("spacing",spacing);
    newTag.setAttribute("lineHeight",lineHeight);
    newTag.setAttribute("height",height);
    newTag.setAttribute("width",width);
    newTag.setAttribute("size",size);
    newTag.setAttribute("speed",speed);
    newTag.setAttribute("control",-1);
    newTag.setAttribute("system",-1);
    newTag.appendChild(this.range.extractContents());
    this.range.insertNode(newTag);
    for(let t of Array.from(newTag.querySelectorAll("tag"))){
      t.classList.add("nut");
      for(let a of Object.keys(isNew))
        if(isNew[a])
          t.setAttribute(a,newTag.getAttribute(a));
    }
    newTag = Array.from(this.textbox.querySelectorAll(".nut"));
    this.range.setStart(newTag[0],0);
    this.range.setEnd(newTag.at(-1),newTag.at(-1).children.length);
    if(this.textbox.highlight){
      this.textbox.highlight.remove();
      this.setHighlight();
    }
    fixText(this.textbox);
    if(this.original){
      this.original.innerHTML = this.textbox.children[0].innerHTML;
      this.original.textObject = null;
    }
  }
  Editor.prototype.insert = function(newNode){
    this.range.insertNode(newNode);
    fixText(this.textbox);
    if(this.original){
      this.original.innerHTML = this.textbox.children[0].innerHTML;
      this.original.textObject = null;
    }
  }
  Editor.prototype.setHighlight = function(){
    if(this.range.startContainer==this.range.endContainer && this.range.endOffset==this.range.startOffset)
      return;
    this.textbox.highlight = document.createElement("div");
    this.textbox.highlight.style.cssText = `
      position:absolute;
      bottom:0px;
      right:0px;
      width:350px;
      padding:3px;
      border:1px solid transparent;
    `;
    this.textbox.highlight.innerHTML = this.textbox.innerHTML;
    this.editor.prepend(this.textbox.highlight);
    let spans = Array.from(this.textbox.highlight.querySelectorAll("span"));
    for(let [i,s] of Array.from(this.textbox.querySelectorAll("span")).entries()){
      spans[i].style.cssText = `
        -webkit-text-fill-color:transparent;
        background-clip:border;
        background:transparent;
      `;
      if(!this.range.isPointInRange(s,1) || !this.range.isPointInRange(s,0)){
        if(s!=this.range.startContainer.parentNode && s!=this.range.endContainer.parentNode)
          continue;
        if(this.range.startContainer!=this.range.endContainer){
          if(s==this.range.startContainer.parentNode && !this.range.isPointInRange(s,1-this.range.startOffset))
            continue;
          if(s==this.range.endContainer.parentNode && !this.range.isPointInRange(s,1-this.range.endOffset))
            continue;
        }
      }
      spans[i].style.background = "#154DB9";
    }
  }
  Editor.prototype.setControlValues = function(replaceRange=true){
    if(replaceRange)
      this.range = getSelection().getRangeAt(0);
    if(this.range.startContainer==this.range.endContainer){
      let e = this.range.startContainer;
      while(!e.getAttribute || e.getAttribute("speed")===null){
        e = e.parentNode;
        if(!e)
          return;
      }
      this.editor.querySelector("#size").value = parseInt(e.getAttribute("size"));
      let ct = parseInt(e.getAttribute("colorTop"));
      this.editor.querySelector("#colorTop").value = ct;
      let cb = parseInt(e.getAttribute("colorBottom"));
      this.editor.querySelector("#colorBottom").value = cb;
      if(cb==ct+1)
        this.editor.querySelector("#colorBottom").value = 0;
      this.editor.querySelector("#speed").value = parseInt(e.getAttribute("speed"));
      this.editor.querySelector("#height").value = parseInt(e.getAttribute("height"));
      this.editor.querySelector("#width").value = parseInt(e.getAttribute("width"));
      this.editor.querySelector("#lineHeight").value = parseInt(e.getAttribute("lineHeight"));
      return;
    }
    this.editor.querySelector("#size").value = 100;
    this.editor.querySelector("#colorTop").value = 0;
    this.editor.querySelector("#colorBottom").value = 0;
    this.editor.querySelector("#speed").value = 11;
    this.editor.querySelector("#height").value = 100;
    this.editor.querySelector("#width").value = 100;
    this.editor.querySelector("#lineHeight").value = 42;
  }
  Editor.prototype.updateSize = function(_,e){
    let v = parseInt(e.value);
    if(v>16**2-1)
      v = 16**2-1;
    if(v<0)
      v = 0;
    if(isNaN(v))
      v = 100;
    e.value = v;
    this.surround({size:v});
  }
  Editor.prototype.updateColor = function(){
    let te = this.editor.querySelector("#colorTop");
    let t = parseInt(te.value);
    if(t>255)
      t = 255;
    if(t<0)
      t = 0;
    if(isNaN(t))
      t = 0;
    te.value = t;
    let be = this.editor.querySelector("#colorBottom");
    let b = parseInt(be.value);
    if(b>255)
      b = 255;
    if(b<0)
      b = 0;
    if(isNaN(b))
      b = 0;
    be.value = b;
    this.surround({color:[t,b]});
  }
  Editor.prototype.updateSpeed = function(_,e){
    let v = parseInt(e.value);
    if(v>255)
      v = 255;
    if(v<0)
      v = 0;
    if(isNaN(v))
      v = 0;
    e.value = v;
    this.surround({speed:v});
  }
  Editor.prototype.updateHeight = function(_,e){
    let v = parseInt(e.value);
    if(v>255)
      v = 255;
    if(v<0)
      v = 0;
    if(isNaN(v))
      v = 0;
    e.value = v;
    this.surround({height:v});
  }
  Editor.prototype.updateWidth = function(_,e){
    let v = parseInt(e.value);
    if(v>255)
      v = 255;
    if(v<0)
      v = 0;
    if(isNaN(v))
      v = 0;
    e.value = v;
    this.surround({width:v});
  }
  Editor.prototype.updateLineHeight = function(_,e){
    let v = parseInt(e.value);
    if(v>255)
      v = 255;
    if(v<0)
      v = 0;
    if(isNaN(v))
      v = 0;
    e.value = v;
    this.surround({lineHeight:v});
  }
  Editor.prototype.updateSpacing = function(_,e){
    let v = parseInt(e.value);
    if(v>255)
      v = 255;
    if(v<0)
      v = 0;
    if(isNaN(v))
      v = 0;
    e.value = v;
    this.surround({spacing:v});
  }
  Editor.prototype.insertPause = function(e){
    if(e.button!=0)
      return;
    setTimeout(()=>{
      let pause = document.createElement("pause");
      pause.style.color = "#FFFFFF";
      pause.innerHTML = "▼";
      this.insert(pause);
    },1);
  }
  Editor.prototype.showButtonPicker = function(e){
    if(e.button!=0)
      return;
    e.stopPropagation();
    this.editor.querySelector("#BMGEditorButtonPicker").style.display = "block";
  }
  Editor.prototype.insertButton = function(e,l){
    e.stopPropagation();
    if(e.button!=0)
      return;
    let id = parseInt(l.getAttribute("id").match(/\d+/)[0]);
    setTimeout(()=>{
      this.insert(buttonIcons[id].cloneNode());
    },1);
  }
  
  let buttonIcons = {
    0:"https://www.ssbwiki.com/File:ButtonIcon-GCN-A.svg",
    1:"https://www.ssbwiki.com/File:ButtonIcon-GCN-B.svg",
    3:"https://www.ssbwiki.com/File:ButtonIcon-GCN-X.svg",
    4:"https://www.ssbwiki.com/File:ButtonIcon-GCN-Y.svg",
    6:"https://www.ssbwiki.com/File:ButtonIcon-GCN-L.svg",
    7:"https://www.ssbwiki.com/File:ButtonIcon-GCN-R.svg",
    5:"https://www.ssbwiki.com/File:ButtonIcon-GCN-Z.svg",
    9:"https://www.ssbwiki.com/File:ButtonIcon-GCN-Start-Pause.svg",
    2:"https://www.ssbwiki.com/File:ButtonIcon-GCN-C-Stick.svg",
    8:"https://www.ssbwiki.com/File:ButtonIcon-GCN-Control_Stick.svg",
    10:"https://www.ssbwiki.com/File:ButtonIcon-GCN-D-Pad.svg"
  }
  
  let loadImage = function(url,destinationObject,destinationKey){
    fetch(url).then(r=>r.text()).then(r=>{
      let image = url.match(/\File:(.+)/)[1];
      let a = r.match(new RegExp(`<a href="(.+?${image})" class="internal" title=".+?">`));
      if(a){
        let img = document.createElement("img");
        img.src = a[1];
        img.style.height = "20px";
        img.style.width = "20px";
        img.style.verticalAlign = "middle";
        img.setAttribute("info",destinationKey);
        destinationObject[destinationKey] = img;
        for(let b of (document.querySelectorAll("#BMGEditorButtonPickerButton")))
          if(b.children.length==1)
            b.prepend(img.cloneNode());
        for(let b of Array.from(document.querySelectorAll(`#BMGEditorButton${destinationKey}`)))
          b.src = img.src;
      }
    });
  }
  
  for(let i of Object.keys(buttonIcons))
    loadImage(buttonIcons[i],buttonIcons,i);
  
  if(typeof(BMG)!=typeof(undefined)){
    BMG.Editor = Editor;
    BMG.buttonIcons = buttonIcons;
  }else{
    window.BMGEditor = Editor;
    window.bmgButtonIcons = buttonIcons;
  }
}
