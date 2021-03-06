
// helpful functions that can be used throughout program.

const randint = (min, max)=> {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shuffleSet = (s)=> {
	let n = s.size
	let a = [];
	for (let e of s) {
		a.push(e);
	}
	for (let i = (n-1); i > 1; i--) {
		j = randint(0, i);
		let temp = a[i];
		a[i] = a[j];
		a[j] = temp;
	}
	return new Set(a);
}

/*
	GraphGenerator
		The GraphGenerator is the mechanism that creates volcano maps!
		When a game is started, a graph is randomly generated using the
		algorithms contained in this generator.  This graph remains
		"hidden" from view, and the player explores the it, attempting
		to find the exit!


	Generation Algorithm
		Currently, the way the graph is generated is by setting up a
		level-based tree of some height _h_.  "Start" is level 0,
		and the "finish" is level _h_.  Each level in between is given
		a random number of nodes.  Then, a path is drawn from start to
		finish, passing through each level.  DrawSinglePath() function
		is called several times, and then all "free" nodes are
		discarded.
*/
var GraphGenerator = (function() {

	let node = (id, level)=> {
		return {'id':id, 'label':id, 'level':level};
	}

	let makeStartNode = ()=> {
		let n = node('start', 0);
		// n['shape'] = 'hexagon';
		// n['color'] = 'green';
		return n;
	}

	let makeFinalNode = (level)=> {
		let n = node('finish', level);
		// n['shape'] = 'star';
		// n['color'] = 'orange';
		return n;
	}

	// let edgeDataItem = (from, to)=> {
	// 	return {'from': from, 'to': to};
	// }

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
	// let generateVisData = (nodeTable, edgeChart)=> {
	// 	let data = {
	// 		"nodes": [],
	// 		"edges": [],
	// 	}
	// 	for (let [i, row] of Object.entries(nodeTable)) {
	// 		for (let [j, node] of Object.entries(row)) {
	// 			if (typeof node === 'undefined') {
	// 				continue
	// 			}
	// 			if (edgeChart.has(node.id) === false) {
	// 				continue
	// 			}
	// 			if (edgeChart.get(node.id).size > 0) {
	// 				data.nodes.push(node);
	// 			}
	// 		}
	// 	}
	// 	for (let [node, edgeSet] of edgeChart.entries()) {
	// 		if (edgeSet.size > 0) {
	// 			for (let nodeTarget of edgeSet.values()) {
	// 				data.edges.push(edgeDataItem(node, nodeTarget));
	// 			}
	// 		}
	// 	}
	// 	return data
	// }


	// let _dataForVis;
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
			// _dataForVis = generateVisData(this.nodeMatrix, this.edgeSetMap);
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

		// get dataForVis() {
		// 	_dataForVis = generateVisData(this.nodeMatrix, this.edgeSetMap);
		// 	return _dataForVis;
		// }
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

	// current level in the volcano. (not the definition as graph level)
	let volcanoLevel = 1;

	// current and previous nodes record your position.
	let currentNode = 'start';
	let previousNode = 'start';

	// discovered and unids record your exploration through the volcano.
	let fullGraph =  GraphGenerator.adjacencyList;
	let discovered = new Map();
	let unids = new Map();
	let solved = new Set();

	// unidPrefix used for display names of the unknown rooms.
	let unidPrefix = 'unknown ';

	// used with the unidPrefix to make a unique id for an unknown room.
	let nextid = 0;


	function init() {
		discovered.set('start', new Set());
		discovered.set('end', new Set());
		solve('start')
	}


	function unite(setA, setB) {
		return new Set([...setA, ...setB])
	}

	function discover(unidNode) {
		if (unids.has(unidNode) !== true) {
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
		return realNode;
	}

	function solve(node) {
		if (!discovered.has(node)) {
			console.warn(`can't solve '${node}'; hasn't been discovered.`);
			return;
		}
		if (isSolved(node)) {
			return;
		}
		let s = shuffleSet(fullGraph.get(node));
		for (let realNode of s) {
			if (realNode !== previousNode) {
				let fakeNode = nextFakeKey();
				unids.set(fakeNode, realNode);
				discovered.get(node).add(fakeNode);
				discovered.set(fakeNode, new Set([node]));
			}
		}
		solved.add(node);
	}

	function nextFakeKey() {
		// let index = 1;
		// let key = unidPrefix + index;
		// while (unids.has(key)) {
		// 	index++;
		// 	key = unidPrefix + index;
		// }
		// return key;
		nextid++;
		return unidPrefix + nextid;
	}

	function getCurrent() {
		return currentNode;
	}

	function getPrevious() {
		return previousNode;
	}

	function getNearby() {
		let arr = [];
		if (discovered.has(currentNode) === true) {
			for (let k of discovered.get(currentNode).values()) {
				arr.push(k);
			}
		}
		return arr;
	}

	function isSolved(id) {
		return solved.has(id);
	}

	function travelTo(id) {
		if (unids.has(id) === true) {
			let name = discover(id);
			previousNode = currentNode;
			currentNode = name;
			return true;
		}
		if (discovered.has(id) === true) {
			previousNode = currentNode;
			currentNode = id;
			return true;
		}
		return false;
	}

	function attemptTravel(id) {
		if (id === undefined) {
			console.warn('attemptTravel: id parameter was undefined.')
			return false;
		}
		if (id === currentNode) {
			return false; // common case, no action required. return silently.
		}
		if (getNearby().includes(id)) {
			return travelTo(id);
		}
		return false;
	}

	// Initialize the Graph Explorer.  See above for definition of init()
	init();

	// returns the public variables/functions through closure.
	return {
		volcanoLevel,  // v: your current level in the volcano.
		solved,        // v: set of solved nodes.
		fullGraph,     // v: Map of Sets : adjacency list of all nodes
		discovered,    // v: set of discovered nodes.
		unids,         // v: set of unknown nodes
		solve,         // f(node): solves a previously discovered node
		discover,      // f(node): THE NODE DISCOVERY ALGORITHM.
		travelTo,      // f(node): directly teleports to node.
		attemptTravel, // f(node): travels to adjacent node if it's possible.
		isSolved,      // f(node): returns {true, false} if node is solved.
		getCurrent,    // f(): returns current Node that player is at.
		getPrevious,   // f(): returns the previous Node that player WAS at.
		getNearby,     // f(): returns a list of adjacent nodes.
	}
}())






/*
	dataConverter is used to convert the adjacency lists into data that is
	useful to vis.js in order to render the graphs.
*/
const dataConverter = (function(){

	const makeNode = (id)=> {
		switch (id) {
		case 'start':
			return {
				'id':     id,
				'label':  id,
				'shape': 'hexagon',
				'color': {'background': 'green'},
			};
		case 'finish':
			return {
				'id':     id,
				'label':  id,
				'shape': 'star',
				'color': {'background': 'orange'},
			}
		}
		return {
			'id':id,
			'label':id,
			'color': {},
		};
	}

	const makeEdge = (from, to)=> {
		return {
			from: from,
			to: to,
		};
	}

	const convertListToVis = (adjList)=> {
		let nodes = [];
		let edges = [];
		for (let [k, v] of adjList) {
			if (v.size <= 0) {continue;} // filter out free nodes.
			nodes.push(makeNode(k));
			for (let n of v.values()) {
				edges.push(makeEdge(k, n));
			}
		}
		let data = {
			nodes: nodes,
			edges: edges,
		};
		return data;
	}

	const removeDuplicateEdges = (visEdges)=> {
		let edges = [];
		let max = visEdges.length - 1;
		let ok = true;
		for (let x of visEdges) {
			for (let y of edges) {
				if ((x['from'] === y['to']) && (x['to'] === y['from'])) {
					ok = false;
					break;
				}
			}
			if (ok === true) {
				edges.push(x);
			}
			ok = true;
		}
		return edges;
	}

	return {
		convertListToVis,
		removeDuplicateEdges,
	}
}());
