# aria-menu

WAI ARIA AAA compliance implementation of menubar/popup menu.

Please see full specs: 

* https://www.w3.org/TR/wai-aria-practices/#menu
* https://www.w3.org/TR/wai-aria-practices/#menubutton

## Initialization

```js
import Popup from 'aria-menu';
document.querySelectorAll('[data-js-popup-button]').forEach(popupButton => new Popup(popupButton).init());
```
