import MenuItem from './MenuItem.js';

export default class PopupMenu {
	/*
	 * This content is based on w3.org design pattern examples and licensed according to the
	 * W3C Software License at
	 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
	 * Please see specification:
	 * https://www.w3.org/TR/wai-aria-practices/#menubutton
	 */
	constructor(domNode, controllerObj) {
		PopupMenu.checkRequiredStructure(domNode);

		this.isMenubar = false;

		this.domNode = domNode;
		this.controller = controllerObj;

		this.menuitems = [];

		this.firstItem = null;
		this.lastItem = null;

		this.hasFocus = false;
		this.hasHover = false;

		this.timout = 60;

		this.handleMouseover = this.handleMouseover.bind(this);
		this.handleMouseout = this.handleMouseout.bind(this);
	}

	init() {
		this.initEventListeners();
		this.initMenuItems();
	}

	initEventListeners() {
		this.domNode.addEventListener('mouseenter', this.handleMouseover);
		this.domNode.addEventListener('mouseleave', this.handleMouseout);
	}

	initMenuItems() {
		// Traverse the element children of domNode: configure each with
		// menuitem role behavior and store reference in menuitems array.
		// Change this to recursive init submenus
		this.domNode.querySelectorAll('[role="menuitem"]').forEach((item) => {
			const menuItem = new MenuItem(item, this);
			menuItem.init();
			this.menuitems.push(menuItem);
		});

		// Use populated menuitems array to initialize firstItem and lastItem.
		const numItems = this.menuitems.length;
		if (numItems > 0) {
			// eslint-disable-next-line prefer-destructuring
			this.firstItem = this.menuitems[0];
			this.lastItem = this.menuitems[numItems - 1];
		}
	}

	handleMouseover() {
		this.hasHover = true;
	}

	handleMouseout() {
		this.hasHover = false;
		setTimeout(this.close.bind(this, false), this.timout);
	}

	setFocusToController(cmd) {
		const command = typeof cmd !== 'string' ? '' : cmd;

		if (command === '') {
			if (this.controller && this.controller.domNode) {
				this.controller.domNode.focus();
			}
			return;
		}

		if (this.controller.isMenubarItem) {
			if (command === 'previous') {
				this.controller.menu.setFocusToPreviousItem(this.controller);
			}
			if (command === 'next') {
				this.controller.menu.setFocusToNextItem(this.controller);
			}
		}
	}

	setFocusToFirstItem() {
		this.firstItem.domNode.focus();
	}

	setFocusToLastItem() {
		this.lastItem.domNode.focus();
	}

	setFocusToPreviousItem(currentItem) {
		if (currentItem === this.firstItem) {
			this.lastItem.domNode.focus();
		} else {
			const index = this.menuitems.indexOf(currentItem);
			this.menuitems[index - 1].domNode.focus();
		}
	}

	setFocusToNextItem(currentItem) {
		if (currentItem === this.lastItem) {
			this.firstItem.domNode.focus();
		} else {
			const index = this.menuitems.indexOf(currentItem);
			this.menuitems[index + 1].domNode.focus();
		}
	}

	open() {
		this.domNode.classList.add('m-active');
		this.domNode.setAttribute('aria-hidden', 'false');
		this.controller.setExpanded(true);

		if (this.controller.isMenubarItem) {
			this.controller.toggleFlyout(this.domNode.clientHeight);
			this.controller.toggleOverlay(true);
		}
	}

	close(force) {
		if (force === true) {
			return this.closePopup();
		}

		let hasFocusInSubmenus = this.hasFocus;
		this.menuitems.forEach((item) => {
			if (item.popupMenu) {
				hasFocusInSubmenus |= item.popupMenu.hasFocus;
			}
		});
		const controllerHasHover = this.controller.isMenubarItem ? this.controller.hasHover : false;

		if (!hasFocusInSubmenus && !this.hasHover && !controllerHasHover) {
			this.closePopup();
		}
	}

	closePopup() {
		this.domNode.classList.remove('m-active');
		this.domNode.setAttribute('aria-hidden', 'true');
		this.controller.setExpanded(false);

		if (this.controller.isMenubarItem) {
			this.controller.toggleFlyout(0);
			this.controller.toggleOverlay(false);
		}
	}

	destroy() {
		this.domNode.removeEventListener('mouseenter', this.handleMouseover);
		this.domNode.removeEventListener('mouseleave', this.handleMouseout);
		this.close(true);
		this.menuitems.forEach(item => item.destroy());
	}

	static checkRequiredStructure(domNode) {
		const msgPrefix = 'PopupMenu constructor argument domNode ';

		// Check whether menubarNode is a DOM element
		if (!(domNode instanceof Element)) {
			throw new TypeError(`${msgPrefix} is not a DOM Element.`);
		}

		// Check whether menubarNode has descendant elements
		if (domNode.childElementCount === 0) {
			throw new Error(`${msgPrefix} has no element children.`);
		}

		// Check whether domNode descendant elements have A elements
		let childElement = domNode.firstElementChild;
		while (childElement) {
			const menuitem = childElement.firstElementChild;
			if (menuitem && menuitem === 'A') {
				throw new Error(`${msgPrefix} has descendant elements that are not A elements.`);
			}
			childElement = childElement.nextElementSibling;
		}
	}
};
