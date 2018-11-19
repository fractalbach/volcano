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

		// Create empty table.
		let table = new Array(nLevels)
		for (let i = 0; i < nLevels; i++) {
			table[i] = new Array()
		}

		// define the last Index int.
		let lastIndex = nLevels - 1

		// Add first node to the table.
		table[0].push(makeStartNode())

		// Add a random number of nodes to each level in between.
		for (let i = 1; i < lastIndex; i++) {
			let nNodes = randint(minNodes, maxNodes);
			for (let j = 0; j < nNodes; j++) {
				table[i].push(node(`room(${i},${j})`, i))
			}
		}

		// Add the last node to the table.
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


	/* 
		Private data members for the graphmaster90000
	*/
	let _dataForVis = Symbol('dataForVis');

	class GraphMaster9000 {
		constructor() {
			this.nodeMatrix = makeTable(8, 5, 10);
			this.edgeSetMap = makeEdgeChart(this.nodeMatrix);
			this.createSinglePath();
		}

		test() {
			return this.nodeMatrix;
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





let container = document.querySelector('#mynetwork');
let options = {
    layout: {
        hierarchical: {
            enabled: true,
            treeSpacing: 1,
            nodeSpacing: 1,
            parentCentralization: true,
        }
    },
    nodes: {
        shape: 'circle',
    },
};

let myNetwork = new vis.Network(container,{},options);
let g = GraphMaster9000;
console.log(g)
let updateGraph = ()=>{
    myNetwork.setData(g.dataForVis);
    myNetwork.setOptions(options);
}
updateGraph()

let addRandomPath = ()=>{
    g.createSinglePath(g.nodeTable, g.edgeChart);
    updateGraph();
}
let changeView = ()=>{
    if (options.layout.hierarchical.enabled === true) {
        options.layout.hierarchical.enabled = false;
        myNetwork.setOptions(options);
        return;
    } else {
        options.layout.hierarchical.enabled = true;
    }
    updateGraph();
}



document.querySelector('#ButtonAddPath').addEventListener('click', addRandomPath);
document.querySelector('#ButtonChangeView').addEventListener('click', changeView);

document.addEventListener('load', ()=>{
});