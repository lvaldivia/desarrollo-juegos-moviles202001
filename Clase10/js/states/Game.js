Game = function(game){}

Game.prototype = {
	create:function(){
		this.gravity = 500;
		this.jumpForce = -400;
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.background = this.game.add.tileSprite(0,0,this.game.width,
													this.game.height,'bakground');
		this.background.autoScroll(-100,0);


		this.player = new Player(this.game,this.gravity);
		this.game.add.existing(this.player);

		this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.spaceBar.onDown.add(this.flap,this);
		this.game.input.onDown.add(this.flap,this);

		this.walls = this.game.add.group();
		//this.walls.add(this.player);
		this.spawnWall = 0;
		this.score = 0;

		this.scoreText = this.game.add.text(0,0,'Score :'+this.score);
		this.scoreText.fill = "#FFFFFF";

		this.maxScore = this.game.add.text(0,0,'Max Score');
		this.maxScore.x = this.game.width - 150;
		this.maxScore.fill = "#FFFFFF";
		this.points = 0;

	},
	update:function(){
		if(!this.player.alive)return;
		this.spawnWall += this.game.time.elapsed;
		if(this.spawnWall>3000){
			this.spawnWall = 0;
			this.createWall();
		}
		this.game.physics.arcade.overlap(this.player,this.walls,null,this.killPlayer,this);
		this.walls.forEachAlive(function(wall){
			if(wall.x<-wall.width){
				wall.kill();
			}else{
				if(!wall.scored){
					if(this.player.x>=wall.x){
						wall.scored = true;
						this.points +=0.5;
						this.scoreText.text = "Score : "+this.points;
					}
				}
			}
		},this);
	},
	killPlayer:function(){
		this.player.kill();
		this.walls.callAll("kill");
	},
	flap:function(){
		this.player.flap(this.jumpForce);
	},
	createWall:function(){
		let wallY = this.game.rnd.integerInRange(this.game.height*0.3,this.game.height*0.7);
		this.generateWall(wallY);
		this.generateWall(wallY,true);
	},
	generateWall:function(wallY,flipped){
		let posY;
		let opening = 400;
		if(flipped){
			wallY = wallY - (opening/2);
		}else{
			wallY = wallY + (opening/2);
		}

		let wall = this.walls.getFirstDead();
		if(wall){
			wall.reset(this.game.width,wallY);
		}else{
			wall = new Wall(this.game,{x:this.game.width,y:wallY});
			//wall = this.game.add.sprite(this.game.width,wallY,'wall');
		}
		this.game.physics.arcade.enable(wall);
		wall.body.velocity.x = -200;
		wall.body.immovable = true;
		wall.body.allowGravity = false;
		this.walls.add(wall);
		if(flipped){
			wall.scale.y = -1;
		}else{
			wall.scale.y = 1;
		}
	}
}