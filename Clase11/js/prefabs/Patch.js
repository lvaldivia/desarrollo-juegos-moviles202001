Patch = function(game,position,texture){
	Phaser.Sprite.call(this,game,position.x,position.y,texture);
	this.inputEnabled = true;
	this.events.onInputDown.add(this.clickPatch,this);
	this.createPlant = new Phaser.Signal();
	this.busy = false;
}

Patch.prototype = Object.create(Phaser.Sprite.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.SetAlhpa = function(dark){
	this.alpha = dark ? 0.5 : 0.1;
	return !dark;
}

Patch.prototype.clickPatch = function(){
	if(!this.busy){
		this.createPlant.dispatch(this.x + (this.width*0.5), this.y + (this.height*0.5),this);
	}
}