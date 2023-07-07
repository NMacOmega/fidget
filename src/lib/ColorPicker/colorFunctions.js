// Nice Idea Functions

// /**
//  * Update the color marker's accessibility label.
//  * @param {number} saturation
//  * @param {number} value
//  */
// function updateMarkerA11yLabel(saturation, value) {
// 	let label = settings.a11y.marker;

// 	saturation = saturation.toFixed(1) * 1;
// 	value = value.toFixed(1) * 1;
// 	label = label.replace('{s}', saturation);
// 	label = label.replace('{v}', value);
// 	colorMarker.setAttribute('aria-label', label);
// }

// /**
//  * Move the color marker when the arrow keys are pressed.
//  * @param {number} offsetX The horizontal amount to move.
//  * @param {number} offsetY The vertical amount to move.
//  */
// function moveMarkerOnKeydown(offsetX, offsetY) {
// 	let x = colorMarker.style.left.replace('px', '') * 1 + offsetX;
// 	let y = colorMarker.style.top.replace('px', '') * 1 + offsetY;

// 	setMarkerPosition(x, y);
// }
