This is primarily for use in my own Pikmin 2 modding tools. Anyone can use it, but it is pretty specifically designed for my own needs. If you went/need changed/additional features, fork this and make your own.
#### How to Use
To create the WYSIWYG editor, create a new Editor object by passing in its parent node. This can be done by either rinning
```js
new BMG.Editor(parentNode)
```
or
```js
new BMGEditor(parentNode)
```
depending on if you have [bmg.js](https://github.com/Degritone/bmg.js) active or not. The former if you do, or the latter if you are using a different BMG parsing library.

Once it's been created, it should work on its own. The class _does_ expose its inner workings publically, if you wish to replace the controls with your own or change the functionality on the fly withour forking the repository.

The Editor class has the following structure:
```js
Editor.editor =           HTMLElement<editor>
Editor.textbox =          HTMLElement<editing>
Editor.setHighlight =     function()
Editor.setControlValues = function(Boolean=true)
Editor.updateSize =       function(InputEvent,HTMLElement<input>)
Editor.updateColor =      function(InputEvent,HTMLElement<input>)
Editor.updateSpeed =      function(InputEvent,HTMLElement<input>)
Editor.updateHeight =     function(InputEvent,HTMLElement<input>)
Editor.updateWidth =      function(InputEvent,HTMLElement<input>)
Editor.updateLineHeight = function(InputEvent,HTMLElement<input>)
Editor.updateSpacing =    function(InputEvent,HTMLElement<input>)
Editor.insertPause =      function(PointerEvent,HTMLElement<(unused)>)
Editor.showButtonPicker = function(PointerEvent,HTMLElement<(unused)>)
Editor.insertButton =     function(PointerEvent,HTMLElement<any>)
Editor.insert =           function(HTMLElement<any>)
Editor.surround =         function(options)
```
If creating your own controls for the editor without changing the functions themselves, note that insertButton expects the input HTMLElement to have an ID with any number between 0 and 10 (inclusive) inside it to signify which button the image corresponds to and the InputEvents in the update functions go unused by default, but _are_ passed into the functions, should you wish to replace any function with your own. The PointerEvents are used to simply check the click in a left click. 

Editor.surround's options object has the following structure:
```js
{
  speed=u8(-1),
  color=array<u8>([-1,-1]),
  size=u8(-1),
  spacing=u8(-1),
  lineHeight=u8(-1),
  height=u8(-1),
  width=u8(-1)
}
```
Editor.surround will set any variables set to -1 in the input object to those found in the most recent <tag> element, or the default Pikmin 2 values if there is no previous <tag> element.

Additional keys are created as the editor is used. Specifically,
```js
Editor.highlight = HTMLElement<div>
Editor.range =     Range
```
Editor.highlight is what allows the text to remain highlighted after clicking off the editor.

Editor.range is a [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) object, set when you click out of the textbox or call `Editor.setControlValues` with an argument that's non-falsy. It is used to determine the text to be modified and where to put buttons or pauses.
