# aria-menu

WAI ARIA 1.1 AAA compliance implementation of menubar/popup menu.

Allows a user to use mouse/touch/keyboard to have fulfilled and rich user experience with navigate a 2-level menu.

It has been modified from w3c aria practice example in the following ways:

* the code has been updated to modern javascript standards
* removed navigations by chars
* added overlays and mouse events handling

## Specs

Please see full specs: 

* https://www.w3.org/TR/wai-aria-practices/#menu
* https://www.w3.org/TR/wai-aria-practices/#menubutton

## Initialization

This module designed as library that could be used as starting point on the project. It is not
"just add the water" ready made component.

```js
import Popup from 'aria-menu';

document.querySelectorAll('[data-js-popup-button]').forEach(popupButton => 
	new Popup(popupButton).init());
```

## License

This software or document includes material copied from or derived from 
[menubar](https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html).
Copyright ©2019 W3C® (MIT, ERCIM, Keio, Beihang).

All Rights Reserved. This work is distributed under the
[W3C® Software License](http://www.w3.org/Consortium/Legal/copyright-software)
in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.

Copyright © 2019, D. Nechepurenko. Published under MIT license.
