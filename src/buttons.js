// _________________________________________
//  Overlay Togglers
// =========================================
(function() {

	// Special Format: (button, overlay, originText, activeText)
	// Used to create overlay togglers by pressing these buttons.
	// This structure is exactly the same as the arguments for 
	// the functoin MakeToggleFunc
	let buttons_and_their_overlays = [
		['#buttonShowMenu', '#overlayMenu', 'Show Menu', 'Hide Menu'],
		['#buttonItems', '#overlayItems', 'Items', 'Items'],
	]

	// currentlyEnabled corresponds to the index of buttons_and_their_overlays.
	// when the value is -1, it means that there is no overlay active, and the
	// default beneath will be shown.
	let currentlyEnabled = -1;

	let disable = (n)=> {
		let [$button, $overlay, originText, activeText] = buttons_and_their_overlays[n];
		let button = document.querySelector($button);
		let overlay = document.querySelector($overlay);
		overlay.classList.add('hidden');
		button.classList.remove('ActivatedButton');
		button.innerText = originText;
	}

	let enable = (n)=> {
		let [$button, $overlay, originText, activeText] = buttons_and_their_overlays[n];
		let button = document.querySelector($button);
		let overlay = document.querySelector($overlay);
		overlay.classList.remove('hidden');
		button.classList.add('ActivatedButton');
		button.innerText = activeText;
	}

	let updateAll = ()=> {
		for (let n of buttons_and_their_overlays.keys()) {
			if (n === currentlyEnabled) {
				enable(n)
			} else {
				disable(n)
			}
		}
	}

	// initialize by making sure that the correct overlay is showing.
	updateAll();

	let toggleHandler = (n)=> {
		if (n === currentlyEnabled) {
			currentlyEnabled = -1;	
		} else {
			currentlyEnabled = n;
		}
		updateAll();
	}

	// MakeToggleFunc returns a function that can be used to toggle 
	// the visibility of different overlays. Maintains the fact that
	// only a single overlay should be visible at any given time.
	let MakeToggleFunc = (n)=> {
		return ()=> {
			toggleHandler(n)
		}
	}

	// generate the event listeners to toggle the windows.
	for (let [n, entry] of buttons_and_their_overlays.entries()) {
		let fn = MakeToggleFunc(n);
		let buttonSel = entry[0];
		document.querySelector(buttonSel).addEventListener('click', fn);
		document.querySelector(buttonSel).addEventListener('keypress', fn);
	}

}());
