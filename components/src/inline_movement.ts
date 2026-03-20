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
		this.#mapped = new WeakSet(this.#slot?.assignedElements() ?? []);
	}

	#onKey(event: KeyboardEvent) {
		if (event.defaultPrevented) return;
		if (event.shiftKey) return;

		if (handleBigJumps(event, this.#slot)) return;
		if (handleArrows(event, this.#slot, this.#mapped, this.#computedStyle)) return;
	}

	#onClick(event: PointerEvent) {
		if (event.defaultPrevented) return;

		for (let node of event.composedPath()) {
			if (node === event.currentTarget) return;
			if (!this.#mapped.has(node)) continue;

			if (!(node instanceof HTMLElement)) return;

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
	sibling.setAttribute("tabindex", "0");
	sibling.focus();
}

function handleBigJumps(event: KeyboardEvent, slot: HTMLSlotElement | null): boolean {
	if ("Home" !== event.key && "End" !== event.key) return false;

	let bigJump = getFirstOrLast(event, slot);
	if (bigJump instanceof HTMLElement) {
			event.preventDefault();
			setNegativeTabIndices(slot);
			focusOnElement(bigJump);
	}

	return true;
}

function handleArrows(event: KeyboardEvent, slot: HTMLSlotElement | null, mapped: WeakSet<EventTarget>, computedStyle: CSSStyleDeclaration) {
	if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return false;

	for (let node of event.composedPath()) {
		if (node === event.currentTarget) return;
		if (!mapped.has(node)) continue;

		let sibling = getSibling(event, node, computedStyle);
		if (sibling instanceof HTMLElement) {
			event.preventDefault();
			setNegativeTabIndices(slot);
			focusOnElement(sibling);
		}
		break;
	}

	return true;
}

function getFirstOrLast(event: KeyboardEvent, slot: HTMLSlotElement | null): Element | undefined {
	if (!slot) return;

	let elements = slot.assignedElements();
	if ("Home" === event.key) return elements[0];
	if ("End" === event.key) return elements[elements.length - 1];
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
