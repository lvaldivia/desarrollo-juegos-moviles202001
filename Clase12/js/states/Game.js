Game = function(game){}

Game.prototype = {
	init:function(currentLevel){
		this.currentLevel = currentLevel ? currentLevel : "level1";
		this.MAX_DISTANCE_SHOOT = 190;
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

		this.game.input.onDown.add(this.prepareShot,this);
		this.setupChicken();
	},
	prepareShot:function(){

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
		enemy.body.onBeginContact.add(this.hitEnemy,enemy);
	},
	hitEnemy:function(){
		
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
	}
}