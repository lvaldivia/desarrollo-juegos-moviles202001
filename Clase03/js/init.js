window.onload = function(){
	let game = new Phaser.Game(360,640,Phaser.AUTO);
	game.state.add('Preload',Preload);
	game.state.start('Preload');
}