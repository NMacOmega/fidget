function setHelpScreen(value) {
	displayingHelp = value;
	let classToggle = 'helpItemHidden';
	document.querySelectorAll('.helpItem').forEach((elem) => {
		if (value === true) return elem.classList.remove(classToggle);
		elem.classList.add(classToggle);
	});
}
