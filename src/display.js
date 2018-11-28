// _________________________________________
//  Displaying the Graph using vis.js
// =========================================
var GraphDisplay = (function() {

	let options = {
		height: '100%',
		width: '100%',
		nodes: {
			shape: 'circle'
		},
		edges: {
			smooth: {
				enabled: true,
				type: 'dynamic',
				roundness: 0.1
			},
		},
	};


	// _________________________________________
	//  Display the Explored Graph
	// =========================================
	let myNetwork = new vis.Network(
		document.querySelector('#mynetwork'),
		{},
		options,
	);

	const updateGraph = ()=>{
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
			if (n.id !== current) {
				n['color']['border'] = 'lightgray';
			}
			if (n.id === current) {
				n['borderWidth'] = 3;
				continue;
			}
			if (GraphExplorer.unids.has(n.id)) {
				n['color']['background'] = 'white';
				continue;
			}
		}
		myExploredNetwork.setData(d);
		myExploredNetwork.setOptions(options);
		myExploredNetwork.fit();
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
	//  GraphDisplay Public
	// =========================================
	return {
		updateExploredGraph,  // f: redraws explored map based on GraphExplorer
	}

}());






// _________________________________________
//  Main
// =========================================
(function() {

	// _________________________________________
	//  Initialize and generate game rooms.
	// =========================================
	game.initRoomMap(GraphGenerator.adjacencyList);
	console.log(game.roomMap);

	// _________________________________________
	//  Updating the Action Buttons and Text
	// =========================================
	let textCurrentLoc = document.querySelector('#text-currentLocation');
	let textRoomState = document.querySelector('#text-roomstate');
	let textActionTitle = document.querySelector('#text-actionButtonTitle');

	// When in Solved Rooms:
	// Update the Actions for movement.
	const updateActionButtons = ()=> {
		ActionButtons.clear();
		if (GraphExplorer.isSolved(GraphExplorer.getCurrent())) {
			textActionTitle.innerText = `Choices:`
			textRoomState.innerText = `✔️ Solved ✔️`;
			addTravelButtons();
		} else {
			textActionTitle.innerText = `Travel:`;
			textRoomState.innerText = 'unsolved';
			addInstaSolveButton();
			addGoBackButton();
		}
	}

	// Instant Solve button is an experiment.
	// Solves the Room when you click it.
	const addInstaSolveButton = ()=> {
		let e = ActionButtons.add('solver', 'Solve Room');
		let fn = ()=> {
			GraphExplorer.solve(GraphExplorer.getCurrent());
			updateMyself();
		}
		e.addEventListener('click', fn);
	}

	// Go Back Button immediately moves the player to the previousNode
	// without solving the room.
	const addGoBackButton = ()=> {
		let e = ActionButtons.add('goback', 'Go Back');
		let fn = ()=> {
			GraphExplorer.travelTo(GraphExplorer.getPrevious());
			updateMyself();
		}
		e.addEventListener('click', fn);
	}

	const addTravelButtons = ()=> {
		for (let v of GraphExplorer.getNearby()) {
			let e = ActionButtons.add(v, v)
			let fn = ()=> {
				GraphExplorer.travelTo(v);
				// GraphExplorer.solve(GraphExplorer.getCurrent());
				updateMyself();
			}
			e.addEventListener('click', fn);
		}
	}

	const updateMyself = ()=> {
		textCurrentLoc.innerText = GraphExplorer.getCurrent();
		updateActionButtons();
		GraphDisplay.updateExploredGraph();
	}
	updateMyself();

	console.log(GraphExplorer);


}());
