// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#using_tabindex

// correlates to start and end

// get bounding rectangle of first and last child
// determine directionality

export const shadowDom = `<slot></slot>`;
export const template = `<template>
	${shadowDom}
<template>`;

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
		console.log(event);
		if ("ArrowUp" === event.key) { }
		if ("ArrowRight" === event.key) { }
		if ("ArrowDown" === event.key) { }
		if ("ArrowLeft" === event.key) { }
	
		if ("rtl" === this.#computedStyle.direction) {
			// reverse direction
		}

		for (let node of event.composedPath()) {
			if (node === event.currentTarget) return;
			if (node instanceof Element && this.#slotted.has(node)) {
				// do something
				/*
					ltr
					left - prevElementSibling
					right - nextElementSibling
				
					rtl
					left - nextElementSibling
					right - prevElementSibling
				*/
				node.nextElementSibling;
				node.previousElementSibling;
			};
		}
	}

	#onClick(event: PointerEvent) {
		console.log(event);

		for (let node of event.composedPath()) {
			if (!(node instanceof HTMLElement)) continue;
			if (!this.#slotted.has(node)) continue;

			// check if active element exists in slotted
			if (
				document.activeElement && this.#slotted.has(document.activeElement)) {
				node.setAttribute("tabindex", "-1");
			}

			node.setAttribute("tabindex", "0");
			node.focus();
		};
	}
}

// function getAssignedNodes(slot: HTMLSlotElement | null, selector: string | null): Element[] {
// 	if (!slot) return [];
// 	if (!selector) return slot.assignedElements();

// 	// let elements: Element[] = [];
// 	// for (let el of slot.assignedElements()) {
// 	// 	if (el.matches(selector)) {
// 	// 		elements.push(el);
// 	// 	}
// 	// }

// 	// return elements;
// }

function getMappedElements(slot: HTMLSlotElement | null): WeakMap<Element, number> {
	let elements = slot?.assignedElements() ?? [];
	let map = new WeakMap();


	for (const [index, el] of elements.entries()) {
		map.set(el, index);
	}

	return map;
}