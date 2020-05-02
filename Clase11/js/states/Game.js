Game = function(game){}

Game.prototype = {
	init:function(currentLevel,msg,show){
		this.currentLevel = currentLevel ? currentLevel : 1;
		this.houseX = 60;
		this.sun_frequency = 5;
		this.sun_velocity = 50;
		this.zombie_y_positions = [49,99,149,199,249];
	},
	create:function(){
		this.background = this.game.add.sprite(0,0,'background');
		this.createLand();
		this.createGUI();
		this.bullets = this.game.add.group();
		this.plants  = this.game.add.group();
		this.zombies = this.game.add.group();
		this.suns = this.game.add.group();

		this.numSums = 1000;
		this.hitSound = this.game.add.audio('hit');
		this.loadLevel();
		this.physics.startSystem(Phaser.Physics.ARCADE);
	},
	loadLevel:function(){
		this.levelName = "level"+this.currentLevel;
		this.levelData = JSON.parse(this.game.cache.getText(this.levelName));
		this.zombieElapsed = 0;
		this.currentZombie = 0;
		
		this.zombieData = this.levelData.zombies;
		this.totalZombie = this.zombieData.length - 1;
		this.zombieTotalTime = this.zombieData[this.currentZombie].time * 1000;
	},
	update:function(){
		this.zombieElapsed+=this.game.time.elapsed;
		if(this.zombieElapsed>=this.zombieTotalTime){
			if(this.currentZombie < this.totalZombie){
				this.currentZombie++;
				this.generateZombie();
				this.zombieTotalTime =  this.zombieData[this.currentZombie].time * 1000;
			}	
		}
		
	},
	generateZombie:function(){
		//generar zombies con pool de objetos y uilizar el arrya de posiciones de arriba this.zombie_y_positions
		//las plantas deben ser con pool de objetos
	}

	createLand:function(){
		this.patches = this.game.add.group();
		let rectangle= this.game.add.bitmapData(40,50);
		rectangle.ctx.fillStyle = "#000";
		rectangle.ctx.fillRect(0,0,40,50);

		let j, patch, alpha;
		let dark = false;

		for(let i = 0;i < 10;i++){
			for(j = 0;j < 5;j++){
				patch = new Patch(this.game,{x:64+i*40,y:24+j*50},rectangle);
				this.patches.add(patch);
				patch.createPlant.add(this.putPlant,this);
				dark = patch.SetAlhpa(dark);
			}
		}
	},
	putPlant:function(x,y,sprite){
		if(this.currentSelection){
			sprite.busy = true;
			let plant = new Plant(this.game, {x: x,y: y},this.currentSelection);
			this.plants.add(plant);
			this.clearSelection();
		}
	},
	createGUI:function(){
		let sun = this.game.add.sprite(10,this.game.height - 20,'sun');
		sun.anchor.setTo(0.5);
		sun.scale.setTo(0.5);
		let style = {font : "14px Arial",fill: '#fff'};
		this.sunLabel = this.game.add.text(22,this.game.height- 28,'',style);
		this.updateStats();
		this.buttonData = JSON.parse(this.game.cache.getText("buttonData"));
		this.buttons = this.game.add.group();
		let button;
		this.buttonData.forEach(function(element,index){
			button = new Button(this.game,{x:80+index*40, 
											y:this.game.height- 35},element,index);
			button.createElement.add(this.showElement,this);
			this.buttons.add(button);
		},this);
	},
	showElement:function(element){
		this.currentSelection = element;
		
	},
	clearSelection:function(){
		this.currentSelection = null;
		this.buttons.forEach(function(element,index){
			element.unselected();
		},this);
	},
	updateStats:function(){

	}
}