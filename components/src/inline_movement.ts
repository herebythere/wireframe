// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#using_tabindex

// correlates to start and end

// get bounding rectangle of first and last child
// determine directionality

export const template = `
	<style></style>
	<slot></slot>
`;

let templateEl = document.createElement("template");
templateEl.setHTMLUnsafe(template);


function getSlotElement(el: HTMLElement): HTMLSlotElement | null {
	let internals = el.attachInternals();
	let ssr = null !== internals.shadowRoot;
	let shadowRoot = internals.shadowRoot 
		? internals.shadowRoot
		: el.attachShadow({ mode: "closed" });
	
	if (!ssr) {
		console.log("NO SSR!");
		shadowRoot.appendChild(document.importNode(templateEl.content, true));
	}

	return shadowRoot.querySelector("slot");
}

export class InlineMovement extends HTMLElement {
	static observerdAttributes = ["data-selector"];

	#boundOnSlotChange = this.#onSlotChange.bind(this);
	#boundOnClick = this.#onClick.bind(this);
	#boundOnKey = this.#onKey.bind(this);
	#slot = getSlotElement(this);
	#computedStyle = window.getComputedStyle(this);

	constructor() {
		super();
		console.log("constructing!")
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if ("data-selector" === name) {
			// update the "selected" slots
		}
	}

	connectedCallback() {
		this.#slot?.addEventListener("slotchange", this.#boundOnSlotChange);
		this.#slot?.addEventListener("click", this.#boundOnClick);
		this.#slot?.addEventListener("keydown", this.#boundOnKey);
	}

	disconnectedCallback() {
		this.#slot?.removeEventListener("slotchange", this.#boundOnSlotChange);
		this.#slot?.removeEventListener("click", this.#boundOnClick);
		this.#slot?.removeEventListener("keydown", this.#boundOnKey);
	}

	#onSlotChange(_event: Event) {
		let selector = this.dataset.selector;
		if (selector) {
			for (let el of this.#slot?.assignedElements() ?? []) {
				el.matches(selector);
				if (!el.hasAttribute("tabindex"))
					el.setAttribute("tabindex", "-1");
			}

		}
	}

	#onKey(event: KeyboardEvent) {
		console.log(event);
		if ("ArrowUp" === event.key) { }
		if ("ArrowRight" === event.key) { }
		if ("ArrowDown" === event.key) { }
		if ("ArrowLeft" === event.key) { }
	
		if ("rtl" === this.#computedStyle.direction) {
			// reverse direction
		}
	}

	#onClick(event: PointerEvent) {
		console.log(event);
		// if click happened on focusable element

		// update el.setAttribute("tabindex", 0);
		
	}
}
