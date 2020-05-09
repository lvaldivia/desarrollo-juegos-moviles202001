Game = function(game){}

Game.prototype = {
	init:function(currentLevel){
		this.currentLevel = currentLevel ? currentLevel : "level1";
		this.MAX_DISTANCE_SHOOT = 300;
		this.MAX_SPEED_SHOT = 1100;
		this.SHOT_FACTOR = 12;
		this.KILL_DIFF = 25;
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.gravity.y = 1000;

		this.blocksCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.enemiesCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.chickenCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.numChicken = 4;
	},
	create:function(){
		this.sky = this.game.add.tileSprite(0,0,this.game.world.width,this.game.world.height,'sky');
		this.chickenHUD = this.game.add.group();

		this.blocks = this.game.add.group();
		this.blocks.enableBody = true;
		this.blocks.physicsBodyType = Phaser.Physics.P2JS;

		this.floor = this.game.add.tileSprite(this.game.world.width*0.5,
												this.game.world.height-24,this.game.world.width,48, 'floor');

		this.blocks.add(this.floor);
		this.floor.body.setCollisionGroup(this.blocksCollisionGroup);
		this.floor.body.collides([this.blocksCollisionGroup,this.enemiesCollisionGroup,this.chickenCollisionGroup]);
		this.floor.body.static = true;

		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.P2JS;		
		this.loadLevel();

		this.pole = this.game.add.sprite(180,500,'pole');
		this.pole.anchor.setTo(0.5,0);

		this.isChickenReady = false;
		this.isPreparingShot = false;
		this.game.input.onDown.add(this.prepareShot,this);
		this.setupChicken();
	},
	prepareShot:function(){
		if(this.isChickenReady){
			this.isPreparingShot = true;
			this.isChickenReady = false;
		}
	},
	loadLevel:function(){
		this.levelData = JSON.parse(this.game.cache.getText(this.currentLevel));
		this.levelData.blocks.forEach(function(block){
			this.createBlock(block);
		},this);
		this.levelData.enemies.forEach(function(enemy){
			this.createEnemy(enemy);
		},this);
	},
	createEnemy:function(data){
		let enemy = new Phaser.Sprite(this.game,data.x,data.y,data.asset);
		this.enemies.add(enemy);
		enemy.body.setCollisionGroup(this.enemiesCollisionGroup);
		enemy.body.collides([this.blocksCollisionGroup,this.chickenCollisionGroup,this.enemiesCollisionGroup]);
		enemy.body.onBeginContact.add(this.hitEnemy,this);
	},
	hitEnemy:function(bodyA,bodyB,shapeA,shapeB,equation){
		
		let  velocityDiff = Phaser.Point.distance(
			new Phaser.Point(equation[0].bodyA.velocity[0],equation[0].bodyA.velocity[1]),
			new Phaser.Point(equation[0].bodyB.velocity[0],equation[0].bodyB.velocity[1]),
		);
		if(velocityDiff > this.KILL_DIFF){
			this.updateDeadCount();	
		}
		
	},
	updateDeadCount:function(){
		
	},
	createBlock:function(data){
		let block = new Phaser.Sprite(this.game,data.x,data.y,data.asset);
		this.blocks.add(block);
		block.body.mass = data.mass;
		block.body.setCollisionGroup(this.blocksCollisionGroup);
		let collision = [this.blocksCollisionGroup,this.enemiesCollisionGroup,this.chickenCollisionGroup];
		block.body.collides(collision);
	},
	setupChicken:function(){
		this.chicken = this.game.add.sprite(this.pole.x,this.pole.y,'chicken');
		this.chicken.anchor.setTo(0.5);
		this.isChickenReady = true;
		this.refreshStats();
	},
	refreshStats:function(){
		this.chickenHUD.removeAll();
		let i = 0;
		while(i< this.numChicken ){
			this.chickenHUD.create(this.game.width- 100 - i*80,30,'chicken');
			i++;
		}
	},
	update: function(){
		if(this.isPreparingShot){
			this.chicken.x = this.game.input.activePointer.position.x;
			this.chicken.y = this.game.input.activePointer.position.y;

			let distance = Phaser.Point.distance(this.chicken.position,this.pole.position);
			if(distance > this.MAX_DISTANCE_SHOOT){
				this.isPreparingShot = false;
				this.isChickenReady = true;
				this.chicken.x = this.pole.x;
				this.chicken.y = this.pole.y;
			}
			if(this.game.input.activePointer.isUp){
				this.isPreparingShot = false;
				this.throwChicken();
			}
		}
	},
	throwChicken:function(){
		this.game.physics.p2.enable(this.chicken);
		this.chicken.body.setCollisionGroup(this.chickenCollisionGroup);
		this.chicken.body.collides([this.blocksCollisionGroup,this.enemiesCollisionGroup,this.chickenCollisionGroup]);

		let diff = Phaser.Point.subtract(this.pole.position,this.chicken.position);

		this.chicken.body.velocity.x = Math.abs(diff.x*this.SHOT_FACTOR) 
						/ (diff.x *this.SHOT_FACTOR) * Math.min(Math.abs(diff.x*this.SHOT_FACTOR),this.MAX_SPEED_SHOT);

		this.chicken.body.velocity.y = Math.abs(diff.y*this.SHOT_FACTOR) 
						/ (diff.y *this.SHOT_FACTOR) * Math.min(Math.abs(diff.y*this.SHOT_FACTOR),this.MAX_SPEED_SHOT);

		this.endTurn();
	},
	endTurn:function(){
		this.numChicken--;

		this.game.time.events.add(3*Phaser.Timer.SECOND,function(){
			this.chicken.kill();

			this.game.time.events.add(Phaser.Timer.SECOND,function(){
				if(this.numChicken>0){
					this.setupChicken();
				}else{
					this.refreshStats();
					this.gameOver();
				}
			},this)
		},this);
	},
	gameOver:function(){
		//GOGAMEOVR
	}
}