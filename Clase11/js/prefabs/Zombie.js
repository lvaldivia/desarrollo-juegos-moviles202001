Zombie = function(game,position,element){
	Phaser.Sprite.call(this,game,position.x,position.y,element.asset);
	this.game = game;
	this.element = element;
	this.anchor.setTo(0.5);
	this.game.physics.arcade.enable(this);
	this.reset(position.x,position.y,element);
}


Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;


Zombie.prototype.reset = function(x,y,data){
	Phaser.Sprite.prototype.reset.call(this,x,y);
	this.loadTexture(data.asset);
	this.animationName = null;
	if(data.hasOwnProperty("animationFrames")){
		this.animationName = data.asset+ "Anim";
		this.animations.add(this.animationName,data.animationFrames,4,true);
		this.animations.play(this.animationName);
	}
	this.attack = data.attack;
	this.defaultVelocity = data.velocity;
	this.body.velocity.x = this.defaultVelocity;
}

Zombie.prototype.damage = function(amount){
	Phaser.Sprite.prototype.damage.call(this, amount);
	var emitter = this.game.add.emitter(this.x, this.y, 50);
	emitter.makeParticles('bloodParticle');
	emitter.minParticleSpeed.setTo(-100, -100);
	emitter.maxParticleSpeed.setTo(100, 100);
	emitter.gravity = 300;
	emitter.start(true, 200, null, 100);
	this.kill();

  /*if(this.health <= 0) {
    let corpse = this.game.add.sprite(this.x, this.bottom, 'deadZombie');
    corpse.anchor.setTo(0.5, 1);
  }*/
}