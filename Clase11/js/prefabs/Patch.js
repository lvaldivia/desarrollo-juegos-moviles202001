Patch = function(game,position,texture){
	Phaser.Sprite.call(this,game,position.x,position.y,texture);
}

Patch.prototype = Object.create(Phaser.Sprite.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.SetAlhpa = function(dark){
	this.alpha = dark ? 0.5 : 0.1;
	return !dark;
}