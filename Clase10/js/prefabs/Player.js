Player = function(game,gravity){
	Phaser.Sprite.call(this,game,0,0,'player');
	this.game = game;
	this.gravity = gravity;
	this.anchor.setTo(0.5);
	this.x = game.world.centerX;
	this.y = game.world.centerY;
	this.animations.add("fly",[0,1,2],10,true);
	this.scale.setTo(4);

	this.game.physics.arcade.enable(this);
	this.body.gravity.y = this.gravity;
	this.frame = 1;
	//this.game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	if(this.body.velocity.y > -20){
		this.frame = 3;
	}else{
		this.animations.play("fly");
	}
}


Player.prototype.flap = function(jumpForce){
	this.body.velocity.y = jumpForce;
}

