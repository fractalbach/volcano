// _________________________________________
//  Displaying the Graph using vis.js
// =========================================
(function() {

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
	}

	updateExploredGraph();


	// _________________________________________
	//  Auto adjust size of graph.
	// =========================================
	window.addEventListener('resize', ()=> {
		myNetwork.fit();
		myExploredNetwork.fit();
	})


	// _________________________________________
	//  Other Tests Go Here
	// =========================================

	console.log(GraphExplorer);

	let textCurrentLoc = document.querySelector('#text-currentLocation');

	const updateMyself = ()=> {
		textCurrentLoc.innerText = GraphExplorer.getCurrent();
		updateActionButtons();
		updateExploredGraph();
	}

	// When in Solved Rooms:
	// Update the Actions for movement.
	const updateActionButtons = ()=> {
		ActionButtons.clear();
		for (let v of GraphExplorer.getNearby()) {
			let e = ActionButtons.add(v, v)
			let fn = ()=>{
				// alert(`You are now traveling to ${v}`);
				// console.log(v)
				GraphExplorer.travelTo(v);
				// console.log(`previous=${GraphExplorer.getPrevious()}, current=${GraphExplorer.getCurrent()}`)
				GraphExplorer.solve(GraphExplorer.getCurrent());
				updateMyself();
			}
			e.addEventListener('click', fn);
		}
	}

	updateMyself();

}());
