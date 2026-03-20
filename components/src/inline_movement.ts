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

export class InlineMovement extends HTMLElement {
	#boundOnSlotChange = this.#onSlotChange.bind(this);
	#boundOnClick = this.#onClick.bind(this);
	#boundOnKey = this.#onKey.bind(this);
	#computedStyle = window.getComputedStyle(this);
	#slot = getSlotElement(this);
	#mapped = new WeakSet<EventTarget>(this.#slot?.assignedElements() ?? []);

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
		this.#mapped = new Set(this.#slot?.assignedElements() ?? []);
	}

	#onKey(event: KeyboardEvent) {
		if (!this.#slot) return;
		if (event.defaultPrevented) return;
		if (event.shiftKey) return;
		if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return

		for (let node of event.composedPath()) {
			if (node === event.currentTarget) return;
			if (!this.#mapped.has(node)) continue;

			let sibling = getSibling(event, node, this.#computedStyle);
			if (sibling instanceof HTMLElement) {
				event.preventDefault();
				setNegativeTabIndices(this.#slot);
				focusOnElement(sibling);
			}
			return;
		}
	}

	#onClick(event: PointerEvent) {
		for (let node of event.composedPath()) {
			if (node === event.currentTarget) return;

			if (!this.#mapped.has(node)) continue;
			if (!(node instanceof HTMLElement)) continue;

			event.preventDefault();
			setNegativeTabIndices(this.#slot);
			focusOnElement(node);
			return;
		};
	}
}

function getSlotElement(el: HTMLElement): HTMLSlotElement | null {
	let internals = el.attachInternals();
	let ssr = null !== internals.shadowRoot;
	let shadowRoot = internals.shadowRoot
		? internals.shadowRoot
		: el.attachShadow({ mode: "closed" });

	if (!ssr)
		shadowRoot.appendChild(document.importNode(templateEl.content, true));

	return shadowRoot.querySelector("slot");
}

function setNegativeTabIndices(slot: HTMLSlotElement | null) {
	if (!slot) return;

	for (let el of slot.assignedElements()) {
		el.setAttribute("tabindex", "-1");
	}
}

function focusOnElement(sibling: HTMLElement) {
	sibling.setAttribute("tabindex", "0")
	sibling.focus();
}

function getSibling(event: KeyboardEvent, node: EventTarget, computedStyle: CSSStyleDeclaration): Element | null | undefined {
	if (!(node instanceof HTMLElement)) return;

	let prev = node.previousElementSibling;
	let next = node.nextElementSibling;
	let { direction } = computedStyle;

	if ("ltr" === direction) {
		if ("ArrowLeft" === event.key) return prev;
		if ("ArrowRight" === event.key) return next;
	}

	if ("rtl" === direction) {
		if ("ArrowRight" === event.key) return prev;
		if ("ArrowLeft" === event.key) return next;
	}
}
