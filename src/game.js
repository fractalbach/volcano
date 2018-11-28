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
			health: 500,
			healthMax: 500,
			attack: 15,
			defense: 15,
			// speed: 10,
			// surpriseBonus: 0,
			// currentAction: 'defend',
		}
	}

	const makeRandomMonster = ()=> {
		let hpMax = randintNorm(20,150);
		let data = {
			health: hpMax,
			healthMax: hpMax,
			attack: randintNorm(10,20),
			defense: randintNorm(10,20),
			// speed: 0,
			// surpriseBonus: 0,
			// currentAction: 'defend',
		}
		return new Ent(data);
	}

	class Ent {
		constructor(data) {
			this.data = defaultEntStats();
			Object.assign(this.data, data);
		}

		isAlive() {
			return (this.data.health > 0)
		}

		hpPercent() {
			return (this.data.health / this.data.healthMax)
		}

	}

	const doBattle = (ent1, ent2)=> {
		if ((ent1 <= 0) || (ent2 <= 0)) {
			console.warn(`You just tried to fight a dead ent.`, ent1, ent2)
			return;
		}
		let ent1Roll = randintNorm(1, 20)
		let ent2Roll = randintNorm(1, 20)
		let ent1Damage = (ent1Roll + ent1.data.attack - ent2.data.defense)
		let ent2Damage = (ent2Roll + ent2.data.attack - ent1.data.defense)
		// prevent damage from going into negatives.
		if (ent1Damage < 0) {ent1Damage = 0}
		if (ent2Damage < 0) {ent2Damage = 0}
		ent2.data.health -= ent1Damage
		ent1.data.health -= ent2Damage
		return [ent1Damage, ent2Damage] // return damage to use as a message.
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
			message: `You have entered a new room.`,
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

		fightMonsterInRoomWith(player) {
			let [d1, d2] = doBattle(player, this.data.monster);
			if (this.data.monster.data.health <= 0) {
				console.log(this.data.monster)
				this.data.isSolved = true;
				this.data.message = `You've defeated the monster!`;
				this.data.monster.data.health = 0;
			} else {
				this.data.message = (
					`You hit the monster for ${d1} damage.` + '\n' +
					`The monster hit you for ${d2} damage.`
				)
			}
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
		// specal message for the first room.
		roomMap.get('start').data.message = `You are at the entrance to the volcano.`
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
