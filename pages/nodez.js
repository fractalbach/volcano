var MyGraphCreator = (function() {

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
	}
}

/* 
converts the list of nodes and edges into a structure that can
be used for vis.js to display the graph.
*/
let combineGraphData = (nodeTable, edgeChart)=> {
	let data = {
		"nodes": [],
		"edges": [],
	}
	for (let [i, row] of Object.entries(nodeTable)) {
		for (let [j, node] of Object.entries(row)) {
			if (typeof node !== 'undefined') {
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


let initGraphCreator = ()=> {
	let nodeTable = makeTable(8, 5, 10);
	let edgeChart = makeEdgeChart(nodeTable);
	createSinglePath(nodeTable, edgeChart);
	let dataForVis = combineGraphData(nodeTable, edgeChart);
	let exportData = {nodeTable, edgeChart, dataForVis};
	console.log(exportData);
	return exportData;
}

let exportData = initGraphCreator();
return {
	dataForVis: exportData.dataForVis,
	nodeTable: exportData.nodeTable,
	edgeChart: exportData.edgeChart,
	createSinglePath,
	combineGraphData,
}

}());