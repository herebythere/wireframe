# Wireframe

A UI component set for the web.

## For developers

Wireframe is delivered as three files:
- A stylesheet containing all css components
- A javascript module exporting all web components
- A json file containing all web components as template elements for SSR



## CSS only components

A single css stylesheet includes the following components:
- button
- checkbox
- radio
- switch
- text inputs
	- text
	- password
	- email
	- url
- number inputs
	- number
	- phone
	- time
	- date
	- datetime-local
- textarea
- meter
- slider
- progress

## Web components

All web components are SSR friendly and their "initial" render is
available as a `<template>` element as a string of plain html.

The following web components are available:
- inline movement
