Button = function(game,position,element,button_function,){
	Phaser.Button.call(this,game,position.x,position.y,element,button_function,this);
}

Button.prototype = Object.create(Phaser.Button.prototype);
Button.prototype.constructor = Button;

