// _________________________________________
//  Displaying the Graph using vis.js
// =========================================
(function() {

	let options = {
		height: '100%',
		width: '100%',
		nodes: {
			shape: 'circle',
		},
		edges: {
			smooth: {
				enabled: true,
				type: 'dynamic',
				roundness: 0.1,
			},
		},
	};

	let g = GraphGenerator;

	let myNetwork = new vis.Network(
		document.querySelector('#mynetwork'),
		{},
		options,
	);

	const updateGraph = ()=>{
		let d = dataConverter.convertListToVis(g.adjacencyList);
		d.edges = dataConverter.removeDuplicateEdges(d.edges);
		myNetwork.setData(d);
		myNetwork.setOptions(options);
		myNetwork.fit();
	}
	updateGraph();


	let myExploredNetwork = new vis.Network(
		document.querySelector('#myExploredNetwork'),
		{},
		options,
	);

	const updateExploredGraph = ()=>{
		let d = dataConverter.convertListToVis(GraphExplorer.discovered);
		d.edges = dataConverter.removeDuplicateEdges(d.edges);
		myExploredNetwork.setData(d);
		myExploredNetwork.setOptions(options);
		myExploredNetwork.fit();
	}
	updateExploredGraph();

	window.addEventListener('resize', ()=> {
		myNetwork.fit();
		myExploredNetwork.fit();
	})

}());



// _________________________________________
//  Other Tests Go Here
// =========================================
(function() {

	console.log(GraphExplorer);
	
}());
