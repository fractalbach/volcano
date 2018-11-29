// _________________________________________
//  Overlay Togglers
// =========================================
(function() {

	// overlayList contains all the overlays that will be closed and hidden.
	let overlayList = [
		'#overlay-FullMap',
		'#overlay-about',
		'#overlay-menu',
	]

	// overlay closers are buttons that reveal the default screen.
	let overlayClosers = [
		'#button-playGame',
		'#button-closeMenu',
	]

	// each menu entries is a button and the overlay it opens.
	let menuEntries = [
		['#button-FullMap', '#overlay-FullMap'],
		['#button-menu', '#overlay-menu'],
		['#button-about', '#overlay-about']
	]

	// convert the lists of selectors into element references.
	overlayList = overlayList.map(item => document.querySelector(item))
	overlayClosers = overlayClosers.map(item => document.querySelector(item))
	menuEntries = menuEntries.map(item => [
		document.querySelector(item[0]),
		document.querySelector(item[1]),
	])

	const closeAllOverlays = ()=> {
		overlayList.forEach(element => element.classList.add('hidden'))
	}

	const openOverlay = (element)=> {
		closeAllOverlays()
		element.classList.remove('hidden')
	}

	// generate event listeners for the menu items.
	menuEntries.forEach(item => {
		let button = item[0]
		let overlay = item[1]
		let fn = ()=> openOverlay(overlay)
		button.addEventListener('click', fn)
		button.addEventListener('keypress', fn)
	})

	// generate event listeners for the overlay closers.
	overlayClosers.forEach(button => {
		button.addEventListener('click', closeAllOverlays)
		button.addEventListener('keypress', closeAllOverlays)
	})

	// special menu closers:
	for (let button of document.getElementsByClassName('closeMenu')) {
		button.addEventListener('click', closeAllOverlays)
		button.addEventListener('keypress', closeAllOverlays)
	}


	// Special Format: (button, overlay, originText, activeText)
	// Used to create overlay togglers by pressing these buttons.
	// This structure is exactly the same as the arguments for
	// the functoin MakeToggleFunc
	// let buttons_and_their_overlays = [
	// ]


	// currentlyEnabled corresponds to the index of buttons_and_their_overlays.
	// when the value is -1, it means that there is no overlay active, and the
	// default beneath will be shown.
	let currentlyEnabled = -1;

	// let disable = (n)=> {
	// 	let [$button, $overlay, originText, activeText] = buttons_and_their_overlays[n];
	// 	let button = document.querySelector($button);
	// 	let overlay = document.querySelector($overlay);
	// 	overlay.classList.add('hidden');
	// 	button.classList.remove('ActivatedButton');
	// 	button.innerText = originText;
	// }
	//
	// let enable = (n)=> {
	// 	let [$button, $overlay, originText, activeText] = buttons_and_their_overlays[n];
	// 	let button = document.querySelector($button);
	// 	let overlay = document.querySelector($overlay);
	// 	overlay.classList.remove('hidden');
	// 	button.classList.add('ActivatedButton');
	// 	button.innerText = activeText;
	// }


	// let updateAll = ()=> {
	// 	for (let n of buttons_and_their_overlays.keys()) {
	// 		if (n === currentlyEnabled) {
	// 			enable(n)
	// 		} else {
	// 			disable(n)
	// 		}
	// 	}
	// }
	//
	// let toggleHandler = (n)=> {
	// 	if (n === currentlyEnabled) {
	// 		// return;
	// 		currentlyEnabled = -1;
	// 	} else {
	// 		currentlyEnabled = n;
	// 	}
	// 	updateAll();
	// }
	//
	// // MakeToggleFunc returns a function that can be used to toggle
	// // the visibility of different overlays. Maintains the fact that
	// // only a single overlay should be visible at any given time.
	// let MakeToggleFunc = (n)=> {
	// 	return ()=> {
	// 		toggleHandler(n)
	// 	}
	// }
	//
	// // initialize by making sure that the correct overlay is showing.
	// updateAll();
	//
	// // generate the event listeners to toggle the windows.
	// for (let [n, entry] of buttons_and_their_overlays.entries()) {
	// 	let fn = MakeToggleFunc(n);
	// 	let buttonSel = entry[0];
	// 	document.querySelector(buttonSel).addEventListener('click', fn);
	// 	document.querySelector(buttonSel).addEventListener('keypress', fn);
	// }

}());



// _________________________________________
//  Action Buttons
// =========================================
let ActionButtons = (function() {

	let buttonParent = document.querySelector('#actionButtonContainer');
	let actionButtons = new Map();

	const clear = ()=> {
		for (let [k, v] of actionButtons.entries()) {
			actionButtons.delete(k);
			buttonParent.removeChild(v);
		}
	}

	const add = (key, text)=> {
		let e = document.createElement('div');
		e.setAttribute('role', 'button');
		e.classList.add('rectangleButton');
		e.innerText = text;
		actionButtons.set(key, e);
		buttonParent.appendChild(e);
		return e;
	}

	const remove = (key)=> {
		if (actionButtons.has(key) !== true) {
			console.warn(`couldn't find '${key}' action button.`);
			return;
		}
		buttonParent.removeChild(actionButtons.get(id));
		actionButtons.delete(id);
	}

	return {
		clear,
		add,
		remove,
	}
}());
