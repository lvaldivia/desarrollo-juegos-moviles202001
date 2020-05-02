Plant = function(game,position,element){
	console.log(element);
	Phaser.Sprite.call(this,game,position.x,position.y,element.plantAsset);
	this.game = game;
	this.element = element;
	this.anchor.setTo(0.5);
	this.game.physics.arcade.enable(this);
	this.body.immovable = true;

	this.shootingTime = 1000;
	this.producingTime = 5000;
	this.shootingElapsed = 0;
	this.producingTime = 0;
}

Plant.prototype = Object.create(Phaser.Sprite.prototype);
Plant.prototype.constructor = Plant;


Plant.prototype.reset = function(x,y,data){
	Phaser.Sprite.prototype.reset.call(this,x,y);
	this.loadTexture(data.plantAsset);
	this.animationName = null;
	if(data.animationFrames){

	}
	if(data.hasOwnProperty("animationFrames")){
		this.animationName = data.plantAsset+ "Anim";
		this.animations.add(this.animationName,data.animationFrames,6,false);
	}
	this.isShooter = false;
	if(data.hasOwnProperty("isShooter")){
		this.isShooter = data.isShooter;	
	}
	this.isSunProducer = false;
	if(data.hasOwnProperty("isSunProducer")){
		this.isSunProducer = data.isSunProducer;
	}
}

Plant.prototype.shoot = function(){
	if(this.animations.getAnimation(this.animationName)){
		this.animations.play(this.animationName);
	}
	//TO-DO create bullet
}

Plant.prototype.update = function(){
	this.shootingElapsed += this.game.time.elapsed;
	this.producingElapsed += this.game.time.elapsed;

	if(this.shootingElapsed >= this.shootingTime){
		this.shootingElapsed = 0;
		this.shoot();
	}
	if(this.producingElapsed >= this.producingTime){
		this.producingElapsed = 0;
		this.generateSun();
	}
}

Plant.prototype.generateSun = function(){
	if(!this.isSunProducer)return;
	//TO-DO generate Sun
}


