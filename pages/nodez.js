var GraphMaster9000 = (function() {

	let node = (id, level)=> {
		return {'id':id, 'label':id, 'level':level};
	}

	let makeStartNode = ()=> {
		let n = node('start', 0);
		n['shape'] = 'star';
		n['color'] = 'green';
		return n;
	}

	let makeFinalNode = (level)=> {
		let n = node('end', level);
		n['shape'] = 'star';
		n['color'] = 'orange';
		return n;
	}

	let edgeDataItem = (from, to)=> {
		return {'from': from, 'to': to};
	}

	let randint = (min, max)=> {
	  	min = Math.ceil(min);
	  	max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	let makeTable = (nLevels, minNodes, maxNodes)=> {
		let table = new Array(nLevels)
		for (let i = 0; i < nLevels; i++) {
			table[i] = new Array()
		}
		let lastIndex = nLevels - 1
		table[0].push(makeStartNode())
		for (let i = 1; i < lastIndex; i++) {
			let nNodes = randint(minNodes, maxNodes);
			for (let j = 0; j < nNodes; j++) {
				table[i].push(node(`room(${i},${j})`, i))
			}
		}
		table[lastIndex].push(makeFinalNode(lastIndex));
		return table;
	}

	let createSinglePath = (table, chart)=> {
		let prevRow = 0;
		let prevCol = 0;
		for (let i = 1; i < table.length; i++) {
			let theChosenColumn = randint(0, table[i].length - 1);
			let prevNode = table[prevRow][prevCol];
			let currNode = table[i][theChosenColumn];
			addEdge(chart, prevNode, currNode);
			prevRow = i;
			prevCol = theChosenColumn;
		}
	}

	let makeEdgeChart = (table)=> {
		let chart = new Map();
		for (let i = 0; i < table.length; i++) {
			for (let j = 0; j < table[i].length; j++) {
				if (typeof table[i][j] === 'undefined') {
					continue
				}
				chart.set(table[i][j]['id'], new Set());
			}
		}
		return chart;
	}

	let addEdge = (chart, node, target)=> {
		if (chart.has(node.id)) {
			chart.get(node.id).add(target.id);
			chart.get(target.id).add(node.id);
		}
	}

	/* 
	converts the list of nodes and edges into a structure that can
	be used for vis.js to display the graph.
	*/
	let generateVisData = (nodeTable, edgeChart)=> {
		let data = {
			"nodes": [],
			"edges": [],
		}
		for (let [i, row] of Object.entries(nodeTable)) {
			for (let [j, node] of Object.entries(row)) {
				if (typeof node === 'undefined') {
					continue
				}
				if (edgeChart.has(node.id) === false) {
					continue
				}
				if (edgeChart.get(node.id).size > 0) {
					data.nodes.push(node);
				}
			}
		}
		for (let [node, edgeSet] of edgeChart.entries()) {
			if (edgeSet.size > 0) {
				for (let nodeTarget of edgeSet.values()) {
					data.edges.push(edgeDataItem(node, nodeTarget));
				}
			}
		}
		return data
	}


	let _dataForVis;
	let nPaths = 5;

	class GraphMaster9000 {
		constructor() {
			this.nodeMatrix = makeTable(8, 5, 10);
			this.edgeSetMap = makeEdgeChart(this.nodeMatrix);
			for (let i = 0; i < nPaths; i++) {
				createSinglePath(this.nodeMatrix, this.edgeSetMap);
			}
			_dataForVis = generateVisData(this.nodeMatrix, this.edgeSetMap);
		}
		createSinglePath() {
			createSinglePath(this.nodeMatrix, this.edgeSetMap);
		}
		get dataForVis() {
			_dataForVis = generateVisData(this.nodeMatrix, this.edgeSetMap);
			return _dataForVis;
		}
	}
	return new GraphMaster9000()
}());


var gamestate = (function(){

	let g = GraphMaster9000;
	let _previousNode = undefined;
	let _currentNode = 'start';
	let _discoveredNodes = new Set(['start', 'end']);
	let _tickCounter = 0;

	class GameState {
		constructor() {}
		get previousNode() {
			return _previousNode;
		}
		get currentNode() {
			return _currentNode;
		}
		get discoveredNodes() {
			return _discoveredNodes;
		}
		get tickCounter() {
			return _tickCounter;
		}
	}
	return new GameState()
}());






var gamedisplay = (function() {
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

	let g = GraphMaster9000;

	let myNetwork = new vis.Network(
		document.querySelector('#mynetwork'),
		{},
		options,
	);

	let changeView = ()=>{
	    if (options.layout.hierarchical.enabled === true) {
	        options.layout.hierarchical.enabled = false;
	    } else {
	        options.layout.hierarchical.enabled = true;
	    }
	    updateGraph();
	}

	let updateGraph = ()=>{
	    myNetwork.setData(g.dataForVis);
	    myNetwork.setOptions(options);
	}

	updateGraph();
	// changeView();


	let showFullMap = ()=> {

	}
	document.querySelector('#ButtonShowFullMap').addEventListener('click', showFullMap);
}());




console.log(GraphMaster9000);
console.log(gamestate);
