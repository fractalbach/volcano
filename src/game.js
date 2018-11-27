var game = (function(){

	const randint = (min, max)=> {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const defaultStats = ()=> {
		return {
			health: 1000,
			attack: 10,
			defense: 10,
			speed: 10,
			surpriseBonus: 0,
		}
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

	class Ent {
		constructor(stats) {
			this.stats = defaultStats();
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

	let myplayer = new Ent();
	let monstermap = new Map();

	return {
		Ent,
		myplayer,
		determineSurprise,
	}

}());

console.log('game:\n', game);
