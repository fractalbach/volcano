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
	}

	updateGraph();

}());



// _________________________________________
//  Other Tests Go Here
// =========================================
(function() {

	console.log(GraphExplorer);
	
}());
