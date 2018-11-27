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
		}
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

	return {
		Ent,
		myplayer,
	}

}());

console.log('game:\n', game);
