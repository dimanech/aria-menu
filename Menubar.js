import MenubarItem from './MenubarItem.js';

export default class Menubar {
	/*
	 * This content is based on w3.org design pattern examples and licensed according to the
	 * W3C Software License at
	 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
	 * Please see specification:
	 * https://www.w3.org/TR/wai-aria-practices/#menu
	 */
	constructor(domNode) {
		Menubar.checkRequiredStructure(domNode);

		this.isMenubar = true;
		this.domNode = domNode;

		this.menubarItems = [];

		this.firstItem = null;
		this.lastItem = null;

		this.hasFocus = false;
		this.hasHover = false;

		this.activationDelay = 500;

		this.body = document.body;
		this.flyout = this.domNode.querySelector('[data-js-menu-flyout-pane]');
	}

	init() {
		this.initEventListeners();

		// Traverse the element children of menubarNode: configure each with
		// menuitem role behavior and store reference in menuitems array.
		let elem = this.domNode.firstElementChild;

		while (elem) {
			const menuElement = elem.firstElementChild;

			if (elem && menuElement && menuElement.tagName === 'A') {
				const menubarItem = new MenubarItem(menuElement, this);
				menubarItem.init();
				this.menubarItems.push(menubarItem);
			}

			elem = elem.nextElementSibling;
		}

		// Use populated menuitems array to initialize firstItem and lastItem.
		const numItems = this.menubarItems.length;
		if (numItems > 0) {
			// eslint-disable-next-line prefer-destructuring
			this.firstItem = this.menubarItems[0];
			this.lastItem = this.menubarItems[numItems - 1];
		}
		this.firstItem.domNode.tabIndex = 0;
	}

	initEventListeners() {
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);

		this.domNode.addEventListener('mouseenter', this.handleMouseEnter);
		this.domNode.addEventListener('mouseleave', this.handleMouseLeave);
	}

	handleMouseEnter() {
		const setIntentionalHover = () => {
			this.hasHover = true;
		};
		this.timeout = setTimeout(setIntentionalHover, this.activationDelay);
	}

	handleMouseLeave() {
		clearTimeout(this.timeout);
		this.hasHover = false;
	}

	setFocusToItem(newItem) {
		let hasAlreadyExpandedItem = false;

		this.menubarItems.forEach((barItem) => {
			if (barItem.domNode.tabIndex === 0) {
				hasAlreadyExpandedItem = barItem.domNode.getAttribute('aria-expanded') === 'true';
			}

			barItem.domNode.tabIndex = -1;
			if (barItem.popupMenu) {
				barItem.popupMenu.close(true);
			}
		});

		newItem.domNode.focus();
		newItem.domNode.tabIndex = 0;

		if (hasAlreadyExpandedItem && newItem.popupMenu) {
			newItem.popupMenu.open();
		}
	}

	setFocusToFirstItem() {
		this.setFocusToItem(this.firstItem);
	}

	setFocusToLastItem() {
		this.setFocusToItem(this.lastItem);
	}

	setFocusToPreviousItem(currentItem) {
		let newItem;

		if (currentItem === this.firstItem) {
			newItem = this.lastItem;
		} else {
			const index = this.menubarItems.indexOf(currentItem);
			newItem = this.menubarItems[index - 1];
		}

		this.setFocusToItem(newItem);
	}

	setFocusToNextItem(currentItem) {
		let newItem;

		if (currentItem === this.lastItem) {
			newItem = this.firstItem;
		} else {
			const index = this.menubarItems.indexOf(currentItem);
			newItem = this.menubarItems[index + 1];
		}

		this.setFocusToItem(newItem);
	}

	toggleOverlay(isOpen) {
		//if (isOpen) {
		//	window.globalOverlay.open('m-partial');
		//} else {
		//	window.globalOverlay.close();
		//}
	}

	toggleFlyout(height) {
		const flyoutStyles = this.flyout.style;

		if (height === 0) {
			flyoutStyles.opacity = 0;
			flyoutStyles.visibility = 'none';
			flyoutStyles.height = '40vh';

			clearTimeout(this.flyoutTimer);
			this.flyoutTimer = setTimeout(() => {
				flyoutStyles.display = 'none';
			}, 300);
		} else {
			clearTimeout(this.flyoutTimer);
			const topPosition = window.scrollY ? window.scrollY : window.pageYOffset;
			flyoutStyles.top = `${parseInt(this.domNode.getBoundingClientRect().bottom + topPosition, 10)}px`;
			flyoutStyles.opacity = 1;
			flyoutStyles.display = 'block';
			flyoutStyles.visibility = 'visible';
			flyoutStyles.height = `${height + 4}px`;
		}
	}

	destroy() {
		this.domNode.removeEventListener('mouseenter', this.handleMouseEnter);
		this.domNode.removeEventListener('mouseleave', this.handleMouseLeave);
		this.menubarItems.forEach((item) => {
			item.domNode.tabIndex = 0;
			item.destroy();
		});
	}

	initRoles() {
		this.domNode.setAttribute('role', 'menubar');
		this.domNode.childs.forEach((child) => {
			if (child.tagName === 'LI') {
				child.setAttribute('role', 'none');
			}
			if (child.tagName === 'A') {
				child.setAttribute('role', 'menuitem');
				child.setAttribute('tabindex', 0);
			}
		});
	}

	static checkRequiredStructure(domNode) {
		const msgPrefix = 'Menubar constructor argument menubarNode ';

		// Check whether menubarNode is a DOM element
		if (!(domNode instanceof Element)) {
			throw new TypeError(`${msgPrefix} is not a DOM Element.`);
		}

		// Check whether menubarNode has descendant elements
		if (domNode.childElementCount === 0) {
			throw new Error(`${msgPrefix} has no element children.`);
		}

		// Check whether menubarNode has A elements
		let menuElement = domNode.firstElementChild;
		while (menuElement) {
			const menubarItem = menuElement.firstElementChild;
			if (menuElement && menubarItem && menubarItem.tagName !== 'A') {
				throw new Error(`${msgPrefix} has child elements are not A elements.`);
			}
			menuElement = menuElement.nextElementSibling;
		}
	}
};
