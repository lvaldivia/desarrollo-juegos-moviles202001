Game = function(game){}

Game.prototype = {
	create:function(){

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
		
		this.levelData =  JSON.parse(this.cache.getText("level"));
		console.log(this.levelData.platformData);
		this.platforms = this.game.add.group();
		this.levelData.platformData.forEach(this.createPlatform,this);
	},
	createPlatform:function(element){
		//primera forma
		let platform = this.game.add.sprite(element.x,element.y,'platform');
		this.platforms.add(platform);

		//segunda forma
	}
}