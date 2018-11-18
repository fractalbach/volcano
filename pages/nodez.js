{


let node = (id, level)=> {
	return {'id':id, 'label':id, 'level':level};
}

// let edgeDataItem = (from, to)=> {
// 	return {'from': from, 'to': to};
// }

let randint = (min, max)=> {
  	min = Math.ceil(min);
  	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let makeTable = (nLevels, minNodes, maxNodes)=> {

	// Create empty table.
	let table = new Array(nLevels)
	for (let i = 0; i < nLevels; i++) {
		table[i] = new Array(maxNodes)
	}

	// Add first and last nodes to the table.
	let lastIndex = nLevels - 1
	table[0][0] = node('start', 0)
	table[lastIndex][0] = node('exit', lastIndex)

	// Add a random number of nodes to each level in between.
	for (let i = 1; i < lastIndex; i++) {
		let nNodes = randint(minNodes, maxNodes);
		for (let j = 0; j < nNodes; j++) {
			table[i][j] = node(`room(${i},${j})`, i)
		}
	}

	return table;
}


let makeEdgeChart = (table)=> {
	let chart = new Map();
	for (let i = 0; i < table.length; i++) {
		for (let j = 0; j < table[i].length; j++) {
			if (!table[i][j]) {
				continue
			}
			chart.set(table[i][j]['id'], new Set());
		}
	}
	return chart;
}

let addEdge = (chart, node, target)=> {
	if (chart.has(node)) {
		chart.get(node).add(target);
	}
}


let startGame = ()=> {
	let nodeTable = makeTable(5, 3, 9);
	let edgeChart = makeEdgeChart(nodeTable);
	console.log(nodeTable, edgeChart);
}
startGame();


}