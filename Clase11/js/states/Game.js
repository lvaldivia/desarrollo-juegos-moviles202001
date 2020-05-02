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
	},
	loadLevel:function(){

	},
	createLand:function(){
		this.patches = this.game.add.group();
		let rectangle= this.game.add.bitmapData(40,50);
		rectangle.ctx.fillStyle = "#000";
		rectangle.ctx.fillRect(0,0,40,50);

		let j, patch, alpha;
		let dark = false;

		for(let i = 0;i < 10;i++){
			for(j = 0;j < 5;j++){
				patch = new Patch(this.game,{x:64+i*40,y:24+j*50,rectangle});
				this.patches.add(patch);
				patch.SetAlhpa(dark);
				dark = !dark;
			}
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
			button = new Button(this.game,{x:80+index*40,y:this.game.height- 35},element.btnAsset)
			button.buttonData = element;
			this.buttons.add(button);
		},this);
	},
	clearSelection:function(){
		this.currentSelection = null;
		this.buttons.forEach(function(element){
			element.alpha = 1;
			element.selected = false;
		},this);
	},
	clickButton:function(sprite){
		if(!sprite.selected){
			this.clearSelection();

		}
	},
	updateStats:function(){

	}
}