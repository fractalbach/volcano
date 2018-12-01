// ______________________________________________________________
//   Display Graph using Vis.js
// ==============================================================
var GraphDisplay = (function() {

	let options = {
		// clickToUse: true,
		height: '100%',
		width: '100%',
		nodes: {
			labelHighlightBold: false,
			borderWidthSelected: 1,
			shape: 'square',
			font: {
				color: 'white',
				size: 20,
			},
		},
		edges: {
			color: {
				inherit: false,
			},
			smooth: {
				enabled: true,
				type: 'dynamic',
				roundness: 0.1
			},
		},
		// interaction: {
		// 	navigationButtons: true,
		// }
	};

	// _________________________________________
	//  Display the Explored Graph
	// =========================================
	let myNetwork = new vis.Network(
		document.querySelector('#mynetwork'),
		{},
		options,
	);

	const updateGraph = ()=> {
		let d = dataConverter.convertListToVis(GraphGenerator.adjacencyList);
		d.edges = dataConverter.removeDuplicateEdges(d.edges);
		myNetwork.setData(d);
		myNetwork.setOptions(options);
		myNetwork.fit();
	}

	updateGraph();

	// _________________________________________
	//  Display the Explored Graph
	// =========================================
	let myExploredNetwork = new vis.Network(
		document.querySelector('#myExploredNetwork'),
		{},
		options,
	);

	const updateExploredGraph = ()=>{
		let d = dataConverter.convertListToVis(GraphExplorer.discovered);
		d.edges = dataConverter.removeDuplicateEdges(d.edges);
		let current = GraphExplorer.getCurrent();
		for (let n of d.nodes) {
			if (n.id === current) {
				n['color']['border'] = '#40f'
				n['color']['background'] = '#67fffe';
				n['borderWidth'] = 4;
				continue;
			}
			if (n.id !== current) {
				n['color']['border'] = 'black';
			}
			if (GraphExplorer.unids.has(n.id)) {
				n['shape'] = 'circle';
				n['color']['background'] = 'rgba(0,0,0,0.3)';
			// } else if (!GraphExplorer.isSolved(n.id)) {
			} else {
				n['color']['background'] = 'green';
			}
		}
		myExploredNetwork.setData(d);
		myExploredNetwork.setOptions(options);
		// myExploredNetwork.fit();
		// myExploredNetwork.moveTo();
	};


	updateExploredGraph();

	// _________________________________________
	//  Auto adjust size of graph.
	// =========================================
	window.addEventListener('resize', ()=> {
		myNetwork.fit();
		myExploredNetwork.fit();
	})


	// _________________________________________
	//  When Nodes are clicked
	// =========================================

	const addNodeSelectListener = (fn)=> {
		myExploredNetwork.on("selectNode", function(params) {
			if (params.nodes === undefined) {
				console.warn("selectNode event: nodes are undefined!");
				return;
			}
			if (params.nodes.length >= 1) {
				let nodeId = params.nodes[0];
				fn(nodeId);
			}
			// console.log('selectNode Event:', params);
	    });
	}

	// _________________________________________
	//  GraphDisplay Public
	// =========================================
	return {
		updateExploredGraph,   // f(): redraws the explored graph display.
		addNodeSelectListener, // f(fn): calls fn(nodeId) when node is selected.
	}

}());







// ~~~~~~====############################################====~~~~~~







// ______________________________________________________________
//   Main
// ==============================================================
(function() {

	// _________________________________________
	//  Initialize Rooms
	// =========================================
	game.initRoomMap(GraphGenerator.adjacencyList);

	// _________________________________________
	//  Interface components
	// =========================================
	let textCurrentLoc = document.querySelector('#text-currentLocation');
	let textRoomState = document.querySelector('#text-roomstate');
	// let textActionTitle = document.querySelector('#text-actionButtonTitle');
	let textMonsterInfo = document.querySelector('#text-monsterinfo');
	let textRoomMessage = document.querySelector('#text-roomMessage');
	let healthBar = document.querySelector('#health');

	let multiTextVolcanoLevel = document.getElementsByClassName('text-volcanoLevel');

	// _________________________________________
	//  Update All
	// =========================================
	// General update of the interface.  Uses information about
	// the current state of the game to determine what will be
	// displayed on the screen.

	const updateAll = ()=> {
		let currentNode = GraphExplorer.getCurrent();
		let currentRoom = game.roomMap.get(currentNode);
		textCurrentLoc.innerText = `${currentNode}`;
		if (
			(currentRoom.isSolved() === true) &&
			(GraphExplorer.isSolved(currentNode) === false)
		) {
			GraphExplorer.solve(currentNode);
		}
		updateRoomMessageText(currentRoom);
		updateActionButtons();
		updateHealthBar();
		checkPlayerHealth();
		checkForWin();
		GraphDisplay.updateExploredGraph();
	}

	// _________________________________________
	//  Update Action Buttons
	// =========================================
	// updateActionButtons is the "main" function that decides which
	// kinds of action buttons will be shown on the screen.

	const updateActionButtons = ()=> {
		ActionButtons.clear();
		if (GraphExplorer.isSolved(GraphExplorer.getCurrent())) {
			// textActionTitle.innerText = `Travel:`;
			textRoomState.innerText = `✔️ Solved ✔️`;
			textMonsterInfo.innerText = 'clear';
			addTravelButtons();
		} else {
			// textActionTitle.innerText = `Fight or Flight:`
			textRoomState.innerText = '⚔️ battle ⚔️';
			updateMonsterText();
			showBattleOption();
			addGoBackButton();
		}
	}

	// _________________________________________
	//  Specific Functions for Updating
	// =========================================
	// Collection of functions that update individual parts of the
	// interface. Includes text, buttons, and graphics.
	// This has been broken apart into smaller functions for code
	// clarity and sanity.
	// -----------------------------------------

	// updateMonsterText fetches information about the monster
	// that is currently in the room.  Displays various data
	// that are relevent to the user.
	const updateMonsterText = ()=> {
		let currentNode = GraphExplorer.getCurrent();
		let monster = game.roomMap.get(currentNode).data.monster;
		// textMonsterInfo.innerText = JSON.stringify(monster, null, 2);
		textMonsterInfo.innerText = `${monster.data.health} / ${monster.data.healthMax}`
	}

	const updateRoomMessageText = (room)=> {
		textRoomMessage.innerText = room.data.message;
	}

	const updateHealthBar = ()=> {
		let hp = game.myplayer.data.health
		let max = game.myplayer.data.healthMax
		healthBar.value = hp
		healthBar.max = max
		healthBar.innerText = hp
	}

	const updateVolcanoLevelText = ()=> {
		for (let element of multiTextVolcanoLevel) {
			element.innerText = `${GraphExplorer.volcanoLevel}`;
		}
	}

	// showBattleOption is a simple button that fights the monster
	// in the room. Does a single exchange of hits between the
	// player and the monster.  nothing special.  Simple combat.
	const showBattleOption = ()=> {
		let e = ActionButtons.add('fight', 'Fight Monster');
		let fn = ()=> {
			let currentNode = GraphExplorer.getCurrent();
			let room = game.roomMap.get(currentNode);
			room.fightMonsterInRoomWith(game.myplayer);
			updateAll();
		}
		e.addEventListener('click', fn);
	}

	// Instant Solve button is for experimental and testing purposes,
	// it will bypass all other mechanics and solve the node.
	const addInstaSolveButton = ()=> {
		let e = ActionButtons.add('solver', 'Solve Room');
		let fn = ()=> {
			GraphExplorer.solve(GraphExplorer.getCurrent());
			updateAll();
		}
		e.addEventListener('click', fn);
	}

	// Go Back Button immediately moves the player to the previousNode
	// without solving the room.
	const addGoBackButton = ()=> {
		let e = ActionButtons.add('goback', 'Go Back');
		let fn = ()=> {
			GraphExplorer.travelTo(GraphExplorer.getPrevious());
			updateAll();
		}
		e.addEventListener('click', fn);
	}

	// Travel buttons are for solved nodes.  It generates buttons
	// that correspond to the nodes adjacent to your current node.
	// Since you have solved the node, you may instantly travel to
	// any of these locations by pushing the button.
	//
	// TODO: Add a sound effect here!
	//
	const addTravelButtons = ()=> {
		for (let v of GraphExplorer.getNearby()) {
			let e = ActionButtons.add(v, v)
			let fn = ()=> {
				GraphExplorer.travelTo(v);
				// GraphExplorer.solve(GraphExplorer.getCurrent());
				updateAll();
			}
			e.addEventListener('click', fn);
		}
	}

	// _________________________________________
	//  Winning and Losing
	// =========================================

	const checkPlayerHealth = ()=> {
		if (game.myplayer.isAlive() === false) {
			OverlayDisplay.openLosePage();
		}
	}

	const checkForWin = ()=> {
		if (
			(GraphExplorer.isSolved('finish')) &&
			(GraphExplorer.getCurrent() === 'finish')
		) {
			OverlayDisplay.openWinPage();
		}
	}

	// _________________________________________
	//  Attempt to travel to a clicked node
	// =========================================

	// generates a handler function and adds it to the vis.js graph.
	// that handler function gets called whenever a node is selected.
	// GraphExplorer will handle the travel logic.
	const initSelectedNodeTravelHandler = ()=> {
		let fn = (node)=> {
			if (GraphExplorer.attemptTravel(node) === true) {
				updateAll();
			}
		}
		GraphDisplay.addNodeSelectListener(fn);
	}


	// _________________________________________
	//  Init and Finish
	// =========================================

	// Initialize At the beginning to show the first set of
	// buttons.  These should always be on the 'START' room.
	updateAll();
	initSelectedNodeTravelHandler();
	updateVolcanoLevelText();

	// Display debug information to the console.
	console.log('GraphExplorer:\n', GraphExplorer);
	console.log('RoomMap:\n', game.roomMap);

}());

//       ~~~ This was the last script to run game code ~~~         //
//                 ~~~ End of Game Program. ~~~                    //
