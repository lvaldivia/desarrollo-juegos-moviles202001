Sun = function(game,x,y,velocity){
	Phaser.Sprite.call(this,game,x,y,'sun');
	this.game = game;
	this.velocity = velocity;
	this.game.physics.arcade.enable(this);
	this.body.velocity.y = velocity;
	//this.animations.add('shine',[0,1,0],10,true);
	//this.animations.play("shine");
	this.anchor.setTo(0.5);
	this.inputEnabled = true;
	this.input.pixelPerfectClick = true;
	this.events.onInputDown.add(this.killSun, this);
	this.increaseSun = new Phaser.Signal();
	this.timerElapsed = 0;
	this.totalSunElapsed = 2000;
}

Sun.prototype = Object.create(Phaser.Sprite.prototype);
Sun.prototype.constructor = Sun;

Sun.prototype.update = function(){
	this.timerElapsed+=this.game.time.elapsed;
	if(this.timerElapsed>=this.totalSunElapsed){
		let tween  = this.game.add.tween(this).to({alpha:0});
		tween.start();
		tween.onComplete.add(this.kill,this);
		this.totalSunElapsed = 0;
	}
}

Sun.prototype.killSun = function(){
	this.increaseSun.dispatch(25);
	this.kill();
}

Sun.prototype.kill = function(){
	Phaser.Sprite.prototype.kill.call(this);
}

Sun.prototype.reset = function(x,y,velocity){
	Phaser.Sprite.prototype.reset.call(this,x,y);
	this.body.velocity.y = velocity;
}
