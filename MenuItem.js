export default class MenuItem {
	/*
	 * This content is based on w3.org design pattern examples and licensed according to the
	 * W3C Software License at
	 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
	 */
	constructor(domNode, menuObj) {
		this.domNode = domNode;
		this.menu = menuObj;
		this.isMenubarItem = false;

		this.blurHandledByController = false;

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
	}

	init() {
		this.domNode.tabIndex = -1;
		this.initEventListeners();
	}

	initEventListeners() {
		this.handleKeydown = this.handleKeydown.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

		this.domNode.addEventListener('keydown', this.handleKeydown);
		this.domNode.addEventListener('click', this.handleClick);
		this.domNode.addEventListener('focus', this.handleFocus);
		this.domNode.addEventListener('blur', this.handleBlur);
	}

	handleKeydown(event) {
		let preventEventActions = false;

		switch (event.keyCode) {
			case this.keyCode.SPACE:
			case this.keyCode.RETURN:
				this.handleKeyReturn(event);
				preventEventActions = true;
				break;

			case this.keyCode.UP:
				this.menu.setFocusToPreviousItem(this);
				preventEventActions = true;
				break;

			case this.keyCode.DOWN:
				this.menu.setFocusToNextItem(this);
				preventEventActions = true;
				break;

			case this.keyCode.LEFT:
				this.handleKeyLeft();
				preventEventActions = true;
				break;

			case this.keyCode.RIGHT:
				this.handleKeyRight();
				preventEventActions = true;
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

			case this.keyCode.ESC:
				this.menu.setFocusToController();
				this.menu.close(true);
				preventEventActions = true;
				break;

			case this.keyCode.TAB:
				this.menu.setFocusToController();
				break;

			default:
				break;
		}

		if (preventEventActions) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	handleKeyReturn(event) {
		let clickEvent;
		// Create simulated mouse event to mimic the behavior of ATs
		// and let the event handler handleClick do the housekeeping.
		try {
			clickEvent = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true,
			});
		} catch (err) {
			if (document.createEvent) {
				// DOM Level 3 for IE 9+
				clickEvent = document.createEvent('MouseEvents');
				clickEvent.initEvent('click', true, true);
			}
		}
		event.currentTarget.dispatchEvent(clickEvent);
	}

	handleKeyRight() {
		this.blurHandledByController = true; // blur and close handled in parent
		this.menu.setFocusToController('next');
	}

	handleKeyLeft() {
		this.blurHandledByController = true;
		this.menu.setFocusToController('previous');
	}

	handleClick() {
		this.menu.setFocusToController();
		this.menu.close(true);
	}

	handleFocus() {
		this.menu.hasFocus = true;
	}

	handleBlur() {
		this.menu.hasFocus = false;
		if (!this.blurHandledByController) {
			setTimeout(this.menu.close.bind(this.menu, false), this.timeout);
		}
	}

	destroy() {
		this.domNode.tabIndex = 0;

		this.domNode.removeEventListener('keydown', this.handleKeydown);
		this.domNode.removeEventListener('click', this.handleClick);
		this.domNode.removeEventListener('focus', this.handleFocus);
		this.domNode.removeEventListener('blur', this.handleBlur);
	}
};
