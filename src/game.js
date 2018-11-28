var game = (function(){

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


	const defaultEntStats = ()=> {
		return {
			health: 1000,
			attack: 10,
			defense: 10,
			speed: 10,
			surpriseBonus: 0,
		}
	}

	const makeRandomMonster = ()=> {
		return {
			health: randint(100,300),
			attack: randint(10,100),
			defense: randint(10,20),
		}
	}

	class Ent {
		constructor(stats) {
			this.stats = defaultEntStats();
			Object.assign(this.stats, stats);
		}
		rollAttack() {
			return randint(0, this.attack);
		}
		rollDefend() {
			return randint(0, this.defense);
		}
		rollDodge() {
			return randint(0, this.speed);
		}
	}

	const defaultRoomData = ()=> {
		return {
			options: new Map(),
			state: new Set(),
			monster: new Ent(),
		}
	}

	class Room {
		constructor(data) {
			this.isSolved = false;
			this.data = defaultRoomData();
			Object.assign(this.data, data);
		}

		call() {
			let fn = this.functionMap[this.state];
			if (typeof fn === "function") {
				fn();
			}
		}
	}

	const generateRoom = ()=> {
		return new Room(
			{monster: new Ent(),},
		);
	}

	let myplayer = new Ent();
	let roomMap = new Map();

	const initRoomMap = (adjlist)=> {
		for (let k of adjlist.keys()) {
			roomMap.set(k, generateRoom());
		}
	}

	return {
		initRoomMap,
		Ent,
		myplayer,
		determineSurprise,
		roomMap
	}

}());

console.log('game:\n', game);
