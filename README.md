# Wireframe

A UI component set for the web.

## For developers

Wireframe exists as three files:

- A stylesheet containing all css components
- A javascript module exporting all web components
- A json file with template elements for SSR (strings)

All components are RTL (right-to-left) compatible.

## For designers

`Wireframe` is named after the technique of drafting low-fidelity interfaces with pen and paper.
It's also a reference to the polygon meshes found in graphics programming.

`Wireframe` is an aesthetically concise UI language. Components must differentiate themselves
from text and each other. Their functionality is telegraphed by their visual accent.

I believe creature comforts like expanding circles are ultimately designed for other designers
(and consequentially job security). They do nothing of signifigance for the user.

Consider `wireframe` a love letter to my former colleagues at Material Design.

## CSS components

A single css stylesheet includes the following components:

- button
    - primary button
    - destructive button
- checkbox
- meter
- number inputs
    - number
    - phone
    - time
    - date
    - datetime-local
- progress
- radio
- slider
- switch
- textarea
- text inputs
    - text
    - password
    - email
    - url

- :focus ring

Components not immediately defined by elements are defined by there role:

```css
input[type=checkbox][role=switch]
[tabindex=0]
```

Components not defined by an element or a role are defined by a `data-wf` attribute.

```html
<li data-wf="icon-button"></li>
```

Lastly outline is a special case.

```html
<li data-wf-outline></li>
```

## Web components

The following web components are available:

- inline movement

## License

Wireframe is released under the BSD 3-Clause License.
