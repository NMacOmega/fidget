function elementDrag(e) {
	e = e || window.event;
	// e.preventDefault();
	// calculate the new cursor position:
	let { x, y } = getVector(e);
	pos1 = pos3 - x;
	pos2 = pos4 - y;
	pos3 = x;
	pos4 = y;
	draggingElement.style.top = draggingElement.offsetTop - pos2 + 'px';
	draggingElement.style.left = draggingElement.offsetLeft - pos1 + 'px';
}

function closeDragElement() {
	// stop moving when mouse button is released:
	document.onpointerup = null;
	document.onpointermove = null;
}

function resetDrag() {
	draggingEnabled = false;
	Object.values(draggables).forEach(({ object, handle, origin }) => {
		handle.style.display = 'none';
		if (origin.top) object.style.top = origin.top;
		if (origin.left) object.style.left = origin.left;
		if (origin.bottom) object.style.bottom = origin.bottom;
		if (origin.right) object.style.right = origin.right;
	});
	enableDragbutton.classList.remove('toggleDragButtonActive');
	setCopyMaterialButtonActive(false);
	setPasteMaterialButtonActive(false);
	materialClipboard = {};
	// updateColorPickerButton(undefined);
	// updateColorPicker("button", undefined);
	colorPickerSet.button(undefined);
}

function onToggleDragClick() {
	draggingEnabled = !draggingEnabled;
	Object.values(draggables).forEach(({ _, handle }) => {
		handle.style.display = draggingEnabled ? 'flex' : 'none';
	});
	if (draggingEnabled) enableDragbutton.classList.add('toggleDragButtonActive');
	else enableDragbutton.classList.remove('toggleDragButtonActive');
}

// Add ability to drag Controls around on screen and locations to reset to if needed
function enableDragHandleControls() {
	draggables = Object.entries(draggableElementsToHandlesMap).reduce(
		(acc, [objId, { handle: handleId, origin }]) => {
			let object = document.querySelector(objId);
			let handle = document.querySelector(handleId);
			if (origin.top) object.style.top = origin.top;
			if (origin.left) object.style.left = origin.left;
			return { ...acc, [objId]: { object, handle, origin } };
		},
		{}
	);
	Object.entries(draggables).forEach(([id, { object, handle }]) => {
		object.onpointerdown = (e) => dragMouseDown(e, id, object, handle);
	});
}

function dragMouseDown(e, dragElemID, dragObject, dragHandle) {
	if (!draggingEnabled) return;
	e = e || window.event;
	// e.preventDefault(); // From example, prevents slidebars from working
	if (dragHandle.id !== e.target.id) return;
	if (dragHandle.id === 'dragHandleColor') {
		lockColorMenuOpen = false;
		setColorPickerLockActive(false);
	}

	draggingElement = dragObject;
	// get the mouse cursor position at startup:
	let { x, y } = getVector(e);
	pos3 = x;
	pos4 = y;

	document.onpointerup = closeDragElement;
	document.onpointermove = elementDrag;
}

function getVector(event, adjustForResolution) {
	let isTouch = event.type.indexOf('touch') > -1;

	let { clientX, clientY } = (() => {
		if (isTouch) return event.touches[0];
		return event;
	})();

	if (adjustForResolution)
		return {
			x: (clientX / window.innerWidth) * 2 - 1,
			y: -(clientY / window.innerHeight) * 2 + 1
		};

	return { x: clientX, y: clientY };
}
