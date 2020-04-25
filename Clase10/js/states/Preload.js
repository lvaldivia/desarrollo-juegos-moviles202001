Preload = function(game){}

Preload.prototype = {
	preload : function(){
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		
		this.load.image("bakground","assets/background-texture.png");
		this.load.spritesheet("player","assets/player.png",48,48,4);
		this.load.image("wall","assets/wall.png");
	},
	create:function(){
		this.state.start("Game");
	}
}