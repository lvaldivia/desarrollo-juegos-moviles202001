window.onload = function(){
	//console.log("NILTON TE IGNORO");
	let game = new Phaser.Game(640,360,Phaser.AUTO,'content',
	{
		preload : loader,
		create : creation,
		update : updatation
	});

	function loader(){
		//console.log("loader");
		game.load.image("background","assets/images/background.png");
	}

	function creation(){
		let bg = game.add.sprite(0,0,'background');
		//console.log("creation");
	}

	function updatation(){
		//console.log("updatation");
	}


}