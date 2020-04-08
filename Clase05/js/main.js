window.onload =function(){
	let game = new Phaser.Game(360, 592,Phaser.AUTO);
	game.state.add("Preload",Preload);
	game.state.add("Game",Game);
	game.state.start("Preload");
}