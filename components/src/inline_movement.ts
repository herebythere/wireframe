// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#using_tabindex

// correlates to start and end

// get bounding rectangle of first and last child
// determine directionality

export const template = `<slot></slot>`;

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

	#selector = this.getAttribute("selector") ?? ":is(input, button, textarea)";
	#slotted = getAssignedNodes(this.#slot, this.#selector);
	#mapped = getMappedElements(this.#slotted);

	constructor() {
		super();
		console.log(this.#slotted);
		console.log(this.#mapped);
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

		for (let node of event.composedPath()) {
			if (node instanceof HTMLElement) {
				let index = this.#mapped.get(node);
			}
		}
	}

	#onClick(event: PointerEvent) {
		console.log(event);

		for (let node of event.composedPath()) {
			if (node instanceof HTMLElement) {
				let index = this.#mapped.get(node);
			}
		}
	}
}

function getAssignedNodes(slot: HTMLSlotElement | null, selector: string | null): Element[] {
	if (!slot) return [];
	if (!selector) return slot.assignedElements();

	let elements: Element[] = [];
	for (let el of slot.assignedElements()) {
		if (el.matches(selector)) {
			elements.push(el);
		}
	}

	return elements;
}

function getMappedElements(elements: Element[]): WeakMap<Element, number> {
	let map = new WeakMap();
	for (const [index, el] of elements.entries()) {
		map.set(el, index);
	}

	return map;
}