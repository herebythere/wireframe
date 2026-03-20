// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#using_tabindex

// correlates to start and end

// get bounding rectangle of first and last child
// determine directionality

export const shadowDom = `<slot></slot>`;
export const template = `<template>
	${shadowDom}
<template>`;

let templateEl = document.createElement("template");
templateEl.setHTMLUnsafe(shadowDom);

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
	#boundOnSlotChange = this.#onSlotChange.bind(this);
	#boundOnClick = this.#onClick.bind(this);
	#boundOnKey = this.#onKey.bind(this);
	#computedStyle = window.getComputedStyle(this);
	#slot = getSlotElement(this);

	#slotted = new Set<Element>(this.#slot?.assignedElements() ?? []);

	constructor() {
		super();
		console.log(this.#slotted);
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
		this.#slotted = new Set(this.#slot?.assignedElements() ?? []);
	}

	#onKey(event: KeyboardEvent) {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			for (let node of event.composedPath()) {
				if (node === event.currentTarget) return;

				if (node instanceof HTMLElement && this.#slotted.has(node)) {
					let sibling = getSibling(event, node, this.#computedStyle.direction);
					if (sibling) {
						for (let el of this.#slotted) {
							el.setAttribute("tabindex", "-1");
						}
						sibling.setAttribute("tabindex", "0")
						sibling.focus();
					}

					return;
				};

			}
		}
	}

	#onClick(event: PointerEvent) {
		for (let node of event.composedPath()) {
			if (!(node instanceof HTMLElement)) continue;
			if (!this.#slotted.has(node)) continue;

			for (let el of this.#slotted) {
				el.setAttribute("tabindex", "-1");
			}

			node.setAttribute("tabindex", "0");
			node.focus();

			return;
		};
	}
}

function getSibling(event: KeyboardEvent, node: HTMLElement, direction: string): HTMLElement | undefined {
	// do something
	/*
		ltr
		left - prevElementSibling
		right - nextElementSibling
	
		rtl
		left - nextElementSibling
		right - prevElementSibling
	*/

	if ("ltr" === direction) {
		if ("ArrowLeft" === event.key) {
			if (node.previousElementSibling instanceof HTMLElement) {
				return node.previousElementSibling;
			}
		}
		if ("ArrowRight" === event.key) {
			if (node.nextElementSibling instanceof HTMLElement) return node.nextElementSibling;
		}
	}

	if ("rtl" === direction) {
		if ("ArrowRight" === event.key) {
			if (node.previousElementSibling instanceof HTMLElement) return node.previousElementSibling;
		}
		if ("ArrowLeft" === event.key) {
			if (node.nextElementSibling instanceof HTMLElement) return node.nextElementSibling;
		}
	}
}
