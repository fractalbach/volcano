// _________________________________________
//  Displaying the Graph using vis.js
// =========================================
(function() {

	let options = {
		height: '100%',
  		width: '100%',
		layout: {
			hierarchical: {
				enabled: false,
			},
		},
	    nodes: {
	        shape: 'circle',
	    },
	    edges: {
	    	arrows: {
				to: {
					enabled: true,
					type: 'arrow',
				},
			},
	    },
	};

	let g = GraphGenerator;

	let myNetwork = new vis.Network(
		document.querySelector('#mynetwork'),
		{},
		options,
	);

	/*
	let changeView = ()=>{
	    if (options.layout.hierarchical.enabled === true) {
	        options.layout.hierarchical.enabled = false;
	    } else {
	        options.layout.hierarchical.enabled = true;
	    }
	    updateGraph();
	}
	*/

	let updateGraph = ()=>{
	    myNetwork.setData(g.dataForVis);
	    myNetwork.setOptions(options);
	}

	updateGraph();
	// changeView();

}());
