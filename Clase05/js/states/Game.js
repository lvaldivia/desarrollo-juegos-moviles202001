Game = function(game){}

Game.prototype = {
	create:function(){
		this.levelData =  JSON.parse(this.cache.getText("level"));
		console.log(this.levelData);
	}
}