Preload = function(game){}

Preload.prototype = {
	preload : function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.load.image('box', 'assets/images/box.png');
	    this.load.image('pig', 'assets/images/pig.png');
	    this.load.image('pole', 'assets/images/pole.png');
	    this.load.image('chicken', 'assets/images/bird.png');
	    this.load.image('floor', 'assets/images/floor.png');
	    this.load.image('concreteBox', 'assets/images/concrete-box.png');
	    this.load.image('sky', 'assets/images/sky.png');
	    this.load.text('level1', 'assets/levels/level1.json');
	},
	create:function(){
		this.state.start("Game");
	}
}