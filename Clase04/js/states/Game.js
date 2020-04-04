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
		
		let pet = this.add.sprite(0,0,"pet");
		pet.anchor.setTo(0.5);
		pet.y = this.world.centerY;
		pet.x = this.world.centerX;

	},
	clickBackground:function(sprite,event){
		if(this.currentKey !=""){
			this.clone(event.position);
		}
		console.log(event.position.x);
		console.log(event.position.y);
	},
	clickElement:function(sprite){
		this.currentKey = sprite.key;
		for(let i=0;i<this.elements.length;i++){
			this.elements[i].alpha = sprite.key == this.elements[i].key ? 0.6 : 1;
		}

	}	
}