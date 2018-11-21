var GraphGenerator = (function() {

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
	let nLevels = 7;
	let minNodes = 2;
	let maxNodes = 6;

	class GraphGenerator {
		constructor() {
			this.nodeMatrix = makeTable(nLevels, minNodes, maxNodes);
			this.edgeSetMap = makeEdgeChart(this.nodeMatrix);
			for (let i = 0; i < nPaths; i++) {
				createSinglePath(this.nodeMatrix, this.edgeSetMap);
			}
			_dataForVis = generateVisData(this.nodeMatrix, this.edgeSetMap);
		}
		createSinglePath() {
			createSinglePath(this.nodeMatrix, this.edgeSetMap);
		}

		getAdjacentNodes(nodeid) {
			return this.edgeSetMap.get(nodeid);
		}

		get adjacencyList() {
			return this.edgeSetMap
		}

		get dataForVis() {
			_dataForVis = generateVisData(this.nodeMatrix, this.edgeSetMap);
			return _dataForVis;
		}
	}
	return new GraphGenerator()
}());



/*
	GraphExplorer 

		GraphExplorer is your trusty navigation map. You update it as you move
		through the volcano.  Noticing passageways, you mark unexplored rooms.
		As you explore those rooms, you document the connections between them,
		slowly but surely building up a graph of the volcano.


	Unknown Nodes

		Unknown nodes are special.  After you 'solve' a node, then you become
		aware of its edges (aka passage-ways).  You don't know what lies beyond
		that passage, you just know that it leads _somewhere_.

		For example, you follow a path to an unknown room.  You get there
		and realize that you've seen it already!  On your map, you notice you have 
		2 unknown nodes: but they are actually the same place!

		Thus, unknown nodes are special: 2 unknown nodes in the PartialGraph CAN 
		represent the exact same node in the FullGraph.

	
	Discovered Nodes

		When you first enter begin to enter an unknown room, you "discover it".
		You become aware of its name, and if you've seen the room before.
		However, that doesn't necesarily mean you have _solved_ it.

		rooms that are Discovered, but Not Solved, will not reveal all of their
		edges to you.   It is assumed that you have no fully entered the room,
		but you are only peering at it through the passageway.  It's enough to
		know whether you have been there before, but not enough to see all 
		of the other passageways.


	Solved Nodes
	
		Solved nodes are where all nodes tend to end up.  Once you have solved
		a room, it means you have identified all of the other passageways in 
		that room.  You may not know where they lead yet, but you know that they
		exist.

*/
let GraphExplorer = (function(){

	let currentNode = 'start';
	let previousNode = 'start';

	let fullGraph =  GraphGenerator.adjacencyMatrix;
	let discovered = new Map();
	let unids = new Map();


	function unite(setA, setB) {
		return new Set([...setA, ...setB])
	}

	function areSetsEqual(setA, setB) {
		if (setA.size !== setB.size) {
			return false;
		}
		for (let a of SetA) {
			if (!setB.has(a)) {
				return false;
			}
		}
		return true;
	}

	function discover(unidNode) {
		if (!unids.has(unidNode)) {
			console.warn(`can't discover '${unidNode}': not in unids.`);
			return;
		}
		let realNode = unids.get(unidNode);
		unids.delete(unidNode);

		// replaceAll: fakeNode -> realNode
		for (let [k,v] of discovered.entries()) {
			// replace value
			if (v.has(unidNode)) {
				v.delete(unidNode);
				v.add(realNode);
			}
			// replace key
			if (k === unidNode) {
				let setA = v;
				discovered.delete(k);
				if (discovered.has(realNode)) {
					let setB = discovered.get(realNode);
					let setC = unite(setA, setB);
					discovered.set(realNode, setC);
					// check to see if our discovery results in further discovery.
					for (let [otherFake, otherReal] of unids.entries()) {
						if (setA.has(otherReal)) {
							discover(otherFake);
						}
					}
				} else {
					discovered.set(realNode, setA);
				}
			}
		}
	}


	function solve(node) {

	}




	// function revealRoom(fakeId) {
	// 	if (!unidNodeMap.has(fakeId)) {
	// 		console.warn(`can't reveal '${fakeId}'. not found in map.`);
	// 		return false;
	// 	}
	// 	let realId = unidNodeMap.get(fakeId);
	// 	unidNodeMap.delete(fakeId);

	// 	if (solvedNodes.has(realId)) {
	// 		// todo
	// 		// reconnect the edges.
	// 	}
	// 	// do something with realId

	// 	return true;
	// }

	// function addToUnids(nodeId) {
	// 	// generate a new fake name.
	// 	unidNameCounter++;
	// 	let fakeName = `Unknown Room ${unidNameCounter}`;
	// 	unidNodeMap.add(fakeName, nodeId);
	// }


	// function gotoNode(nodeId) {
	// 	if (unidNodeMap.has(nodeId) === true) {
	// 		// get real name.
	// 		// reveal room.
	// 		// fallthrough.
	// 	}
	// 	if (discoveredNodes.has(nodeId) === true) {
	// 		previousNode = currentNode;
	// 		currentNode = nodeId;
	// 		return true;
	// 	}
	// 	console.warn(`can't find node: '${nodeId}' in set of discovered nodes.`)
	// 	return false;
	// }

	// function solveNode(nodeId) {
	// 	let nearbyNodes = getNodesConnectedTo(nodeId);
	// 	for (let n of nearbyNodes) {
	// 		addToUnids(n.id)
	// 	}

	// 	// unite()
	// 	// solvedNodes.add(nodeId);
	// }

	// // initialize:
	// solveNode('start');

	return {
		discover,
		solve,
	}
}())

var gamestate = (function(){

	let g = GraphExplorer;

}());




console.log(GraphGenerator);
console.log(gamestate);
