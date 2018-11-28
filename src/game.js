var game = (function(){

	// ____________________________________________________________
	//   Functions for Random Numbers
	// ============================================================

	const randint = (min, max)=> {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const randintNorm = (min, max)=> {
		min = Math.ceil(min);
		max = Math.floor(max);
		let r = (Math.random() + Math.random()) / 2;
		return Math.floor(r * (max - min + 1)) + min;
	}

	// ____________________________________________________________
	//   Functions for General Mechanics
	// ============================================================

	// determine Surprise will calculate which party will be surprised,
	//  'M':  monster is surprised
	//  '-':  neither is surprised
	//  'P':  player is surprised
	//
	// mosnter or player bonus should be a number between 0-1,
	// higher bonus means less likely to get surprised AND means higher
	// chance of surprising the other party.
	//
	const determineSurprise = (playerBonus=0, monsterBonus=0)=> {
		zoneOfNeither = 0.3;
		playerRoll = Math.random();
		monsterRoll = Math.random();
		difference = (playerRoll + playerBonus) - (monsterRoll + monsterBonus);
		if (difference > zoneOfNeither) {
			return 'M'
		}
		if (difference < -zoneOfNeither) {
			return 'P'
		}
		return '-'
	}

	// ____________________________________________________________
	//   Entity - class for Monsters and Players
	// ============================================================

	const defaultEntStats = ()=> {
		return {
			health: 1000,
			attack: 100,
			defense: 20,
			speed: 10,
			surpriseBonus: 0,
		}
	}

	const makeRandomMonster = ()=> {
		let hpMax = randintNorm(100,300);
		return {
			attack: randintNorm(10,100),
			defense: randintNorm(10,20),
			health: hpMax,
			healthMax: hpMax,
			currentAction: 'defend',
		}
	}

	class Ent {
		constructor(stats) {
			this.stats = defaultEntStats();
			Object.assign(this.stats, stats);
		}

		isAlive() {
			return (this.stats.health <= 0)
		}

		hpPercent() {
			return (this.stats.health / this.stats.healthMax)
		}

	}

	const battle = ()=> {

	}

	// ____________________________________________________________
	//   Room - container for the data at each node.
	// ============================================================

	const defaultRoomData = ()=> {
		return {
			isSolved: false,
			options: new Map(),
			state: new Set(),
			monster: makeRandomMonster(),
		}
	}

	class Room {
		constructor(data) {
			this.data = defaultRoomData();
			Object.assign(this.data, data);
		}

		isSolved() {
			return this.data.isSolved;
		}
	}

	const generateRoom = ()=> {
		return new Room();
	}

	// ____________________________________________________________
	//   Init, and Public Variables & Functions
	// ============================================================

	let myplayer = new Ent();
	let roomMap = new Map();

	const initRoomMap = (adjlist)=> {
		for (let k of adjlist.keys()) {
			roomMap.set(k, generateRoom());
		}
	}

	return {
		// class definitions
		Ent,
		Room,

		// functions
		initRoomMap,       // void, make sure to call this first.
		determineSurprise, // returns 'M', 'P', or '-'.

		// variables
		roomMap,  // map of (nodeid) --> (Room object)
		myplayer, // special instance of class Ent.
	}

}());

console.log('game:\n', game);
