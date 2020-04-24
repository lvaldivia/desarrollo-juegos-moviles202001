Game = function(game){}

Game.prototype = {
	create:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 1000;

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;

		this.levelData =  JSON.parse(this.cache.getText("level"));
		this.platforms = this.add.group();
		this.platforms.enableBody = true;
		this.fires = this.add.group();
		this.fires.enableBody = true;
		this.levelData.platformData.forEach(this.createPlatform,this);
		this.platforms.setAll("body.allowGravity",false);
		this.platforms.setAll("body.immovable",true);

		this.levelData.fireData.forEach(this.createFire,this);
		this.fires.setAll("body.allowGravity",false);


		this.ground = this.add.sprite(0,0,'ground');
		this.ground.y = this.game.height - this.ground.height;

		this.physics.arcade.enable(this.ground);
		this.ground.body.allowGravity = false;
		this.ground.body.immovable = true;
		this.createPlayer();
		this.barrils = this.game.add.group();
		this.barrils.enableBody = true;

		this.barrelFrequency = this.levelData.barrelFrequency * 1000;
		this.barrelSpeed = this.levelData.barrelSpeed;
		this.elapsedTime = 0;

	},
	createPlayer:function(){
		this.player = this.game.add.sprite(this.levelData.playerStart.x,this.levelData.playerStart.y,
																				'player_spritesheet');
		this.player.anchor.setTo(0.5);
		this.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.animations.add("walking",[0,1,2,1],10,true);
		this.keys = this.input.keyboard.createCursorKeys();
		this.createButtons();
		this.playerActions = {left:false,right:false,up:false};
	},

	createButtons:function(){
		this.leftButton = this.game.add.sprite(0,0,'arrowButton');
		this.leftButton.inputEnabled = true;
		this.leftButton.direction = "left";
		this.leftButton.y = this.game.height - this.leftButton.height;
		this.leftButton.events.onInputDown.add(this.pressButton,this);
		this.leftButton.events.onInputUp.add(this.releaseButton,this);

		this.rightButton = this.game.add.sprite(this.leftButton.width + 10,0,'arrowButton');
		this.rightButton.inputEnabled = true;
		this.rightButton.direction = "right";
		this.rightButton.y = this.game.height - this.rightButton.height;
		this.rightButton.events.onInputDown.add(this.pressButton,this);
		this.rightButton.events.onInputUp.add(this.releaseButton,this);


		this.actionButton = this.game.add.sprite(0,0,'actionButton');
		this.actionButton.inputEnabled = true;
		this.actionButton.direction = "up";
		this.actionButton.x = this.game.width - this.actionButton.width;
		this.actionButton.y = this.game.height - this.actionButton.height;
		this.actionButton.events.onInputDown.add(this.pressButton,this);
		this.actionButton.events.onInputUp.add(this.releaseButton,this);
	},
	pressButton:function(sprite){
		switch(sprite.direction){
			case "left":
				this.playerActions.left = true;
			break;
			case "right":
				this.playerActions.right = true;
			break;
			case "up":
				this.playerActions.up = true;
			break;
		}
	},
	releaseButton:function(sprite){
		switch(sprite.direction){
			case "left":
				this.playerActions.left = false;
			break;
			case "right":
				this.playerActions.right = false;
			break;
			case "up":
				this.playerActions.up = false;
			break;
		}
	},

	createFire:function(element){
		this.fires.create(element.x,element.y,'fire_spritesheet');
	},

	createBarrel:function(){
		let barrel = this.barrils.getFirstDead();
		if(!barrel){
			barrel = this.game.add.sprite(this.levelData.goal.x,this.levelData.goal.y,'barrel');
			this.barrils.add(barrel);
		}else{
			console.log("revive");
			barrel.reset(this.levelData.goal.x,this.levelData.goal.y);
		}
		barrel.body.velocity.x = 200;
		barrel.body.collideWorldBounds = true;
		barrel.body.bounce.setTo(1,0.5);
	},

	update:function(){
		if(!this.player.alive){
			return;
		}
		this.elapsedTime += this.time.elapsed;
		if(this.elapsedTime >= this.barrelFrequency){
			this.elapsedTime = 0;
			this.createBarrel();
		}

		this.barrils.forEachAlive(function(element){
			if(element.y >= 600){
				element.kill();
			}
		},this);

		this.physics.arcade.collide(this.player,this.ground);

		this.physics.arcade.collide(this.ground,this.barrils);
		this.physics.arcade.collide(this.player,this.platforms);
		this.physics.arcade.collide(this.platforms,this.barrils);

		this.physics.arcade.overlap(this.player,this.barrils,null,this.checkCollision,this);

		this.player.body.velocity.x = 0;

		if((this.keys.up.isDown || this.playerActions.up) && this.player.body.touching.down){
			this.player.body.velocity.y = -700;
		}

		if(this.keys.left.isDown || this.playerActions.left){
			this.player.body.velocity.x = -150;
			this.player.animations.play("walking");
			this.player.scale.setTo(1);
		}else if(this.keys.right.isDown || this.playerActions.right){
			this.player.body.velocity.x = 150;
			this.player.animations.play("walking");
			this.player.scale.setTo(-1,1);
		}else{
			this.player.frame = 3;
		}
	},
	checkCollision:function(sprite1,sprite2){
		sprite1.kill();
		sprite2.kill();
		this.barrils.callAll("kill");
	},
	render:function(){
		//this.game.debug.body(this.ground);
		//this.game.debug.body(this.player);
	},
	createPlatform:function(element){
		//primera forma
		//let platform = this.game.add.sprite(element.x,element.y,'platform');
		//this.platforms.add(platform);

		//segunda forma
		//this.platforms.create(element.x,element.y,'platform');

		//tercera forma
		let platform = new Phaser.Sprite(this,element.x,element.y,'platform');
		this.platforms.add(platform);
	}
}