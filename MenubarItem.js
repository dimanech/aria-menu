import PopupMenu from './PopupMenu.js';

export default class MenubarItem {
	/*
	 * This content is based on w3.org design pattern examples
	 * and licensed according to the W3C Software License at
	 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
	 */
	constructor(domNode, menuObj) {
		this.menu = menuObj;
		this.domNode = domNode;
		this.popupMenu = false;

		this.hasFocus = false;
		this.hasHover = false;

		this.isMenubarItem = true;
		this.timeout = 60;

		this.keyCode = Object.freeze({
			TAB: 9,
			RETURN: 13,
			ESC: 27,
			SPACE: 32,
			PAGEUP: 33,
			PAGEDOWN: 34,
			END: 35,
			HOME: 36,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
		});

		this.handleKeydown = this.handleKeydown.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleMouseover = this.handleMouseover.bind(this);
		this.handleMouseout = this.handleMouseout.bind(this);
	}

	init() {
		this.domNode.tabIndex = -1;
		this.initEventListeners();

		// Initialize pop up menus
		const nextElement = this.domNode.nextElementSibling;
		if (nextElement && nextElement.hasAttribute('role', 'menu')) {
			this.popupMenu = new PopupMenu(nextElement, this);
			this.popupMenu.init();
		}
	}

	initEventListeners() {
		this.domNode.addEventListener('keydown', this.handleKeydown);
		this.domNode.addEventListener('focus', this.handleFocus);
		this.domNode.addEventListener('blur', this.handleBlur);
		this.domNode.addEventListener('mouseenter', this.handleMouseover);
		this.domNode.addEventListener('mouseleave', this.handleMouseout);
	}

	handleKeydown(event) {
		let preventEventActions = false;

		switch (event.keyCode) {
			case this.keyCode.SPACE:
			case this.keyCode.RETURN:
			case this.keyCode.DOWN:
				if (this.popupMenu) {
					this.popupMenu.open();
					this.popupMenu.setFocusToFirstItem();
					preventEventActions = true;
				}
				break;

			case this.keyCode.LEFT:
				this.menu.setFocusToPreviousItem(this);
				preventEventActions = true;
				break;

			case this.keyCode.RIGHT:
				this.menu.setFocusToNextItem(this);
				preventEventActions = true;
				break;

			case this.keyCode.UP:
				if (this.popupMenu) {
					this.popupMenu.open();
					this.popupMenu.setFocusToLastItem();
					preventEventActions = true;
				}
				break;

			case this.keyCode.HOME:
			case this.keyCode.PAGEUP:
				this.menu.setFocusToFirstItem();
				preventEventActions = true;
				break;

			case this.keyCode.END:
			case this.keyCode.PAGEDOWN:
				this.menu.setFocusToLastItem();
				preventEventActions = true;
				break;

			case this.keyCode.TAB:
				if (this.popupMenu) {
					this.popupMenu.close(true);
				}
				break;

			case this.keyCode.ESC:
				if (this.popupMenu) {
					this.popupMenu.close(true);
				}
				break;

			default:
				break;
		}

		if (preventEventActions) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	setExpanded(isExpanded) {
		this.domNode.setAttribute('aria-expanded', isExpanded.toString());
	}

	handleFocus() {
		this.menu.hasFocus = true;
	}

	handleBlur() {
		this.menu.hasFocus = false;
	}

	handleMouseover() {
		if (this.hasHover) {
			return;
		}
		this.hasHover = true;
		const openMenu = () => {
			if (this.menu.hasHover && this.hasHover) {
				if (this.popupMenu) {
					setTimeout(this.popupMenu.open.bind(this.popupMenu, false), this.timeout);
				}
				clearTimeout(secondChance);
			}
		};
		// ensure that user still here to avoid quick hover into the link lags
		const secondChance = setTimeout(openMenu, this.menu.activationDelay + 30);
		openMenu();
	}

	handleMouseout() {
		this.hasHover = false;
		if (this.popupMenu) {
			setTimeout(this.popupMenu.close.bind(this.popupMenu, false), this.timeout);
		}
	}

	toggleFlyout(height) {
		this.menu.toggleFlyout(height);
	}

	toggleOverlay(isOpen) {
		this.menu.toggleOverlay(isOpen);
	}

	destroy() {
		this.domNode.removeEventListener('keydown', this.handleKeydown);
		this.domNode.removeEventListener('focus', this.handleFocus);
		this.domNode.removeEventListener('blur', this.handleBlur);
		this.domNode.removeEventListener('mouseenter', this.handleMouseover);
		this.domNode.removeEventListener('mouseleave', this.handleMouseout);

		if (this.popupMenu) {
			this.popupMenu.destroy();
		}
	}
};
