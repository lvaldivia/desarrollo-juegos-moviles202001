Preload = function(game){}

Preload.prototype = {
	preload : function(){
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		
		this.load.image("bakground","assets/background-texture.png?v=1");
		this.load.spritesheet("player","assets/player.png?v=1",48,48,4);
		this.load.image("wall","assets/wall.png?v=1");
	},
	create:function(){
		this.state.start("Game");
	}
}