Game = function(game){

}

Game.prototype = {
	create:function(){
		let horizontal = this.world.width / 4;
		let	init = 50;
		let bg = this.add.sprite(0,0,"background");
		bg.inputEnabled = true;
		bg.events.onInputDown.add(this.clickBackground,this);

		this.elements = [];
		let elements_key = ["candy","apple","rotate","rubber_duck"];
		this.currentKey = "";
		let candy;
		for(let i=0;i<elements_key.length;i++){
			candy = this.add.sprite(0,0,elements_key[i]);
			candy.anchor.setTo(0.5);
			candy.y = this.world.height*3/4;
			candy.x = (horizontal*i) + init;
			this.elements.push(candy);
			candy.inputEnabled = true;
			candy.events.onInputDown.add(this.clickElement,this);
		}
		
		this.pet = this.add.sprite(0,0,"pet");
		this.pet.anchor.setTo(0.5);
		this.pet.y = this.world.centerY;
		this.pet.x = this.world.centerX;

		this.pet.animations.add('funnyfaces', [1, 2, 3, 2, 1], 7, false);	

	},
	clickBackground:function(sprite,event){
		if(this.currentKey !=""){
			this.clone(event.position,this);
		}
	},
	clone:function(position){
		let element_clone = this.add.sprite(position.x,position.y,this.currentKey);
		element_clone.anchor.setTo(0.5);

		let tweens = this.add.tween(this.pet).to({x:element_clone.x,y:element_clone.y});
		tweens.start();
		tweens.onComplete.add(this.playAnimation,this);
		this.pet.bringToTop();
	},
	playAnimation:function(){
		this.pet.animations.play("funnyfaces");
	},
	clickElement:function(sprite){
		this.currentKey = sprite.key;
		for(let i=0;i<this.elements.length;i++){
			this.elements[i].alpha = sprite.key == this.elements[i].key ? 0.6 : 1;
		}

	}	
}