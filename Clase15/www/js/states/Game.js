Game = function (game) {};

Game.prototype = {
  init:function(level){
    this.currentLevel = level || "level0";
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED  = 500;
    this.BOUNCING_SPEED = 150;
    this.dbRef = firebase.database().ref();
    this.uid  = null;
    if(localStorage.uid!=null){
      this.uid = localStorage.uid;
    }else{
      this.uid = this.uuidv4();
      localStorage.uid = this.uid;
    }
    this.users = this.dbRef.child("users");
    this.users.child(this.uid).set({name:"Luis",last_name:"valdivia",uid:this.uid});
    that = this;
    this.users_firebase = firebase.database().ref("users")
          .once('value').then(function(snapshot){
            //console.log(snapshot.val());
            let values = snapshot.val();
            for (let key in values){
              //console.log(values[key]);
            }
            console.log(that);
            console.log(that.game);
    });
  },
  uuidv4:function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  create:function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    
    this.loadLevel();
    this.createPlayer();
    this.createEnemy();
    this.createGoal();
    this.createButtons();
  },
  createButtons:function(){
    this.leftButton = this.game.add.sprite(0,0,'arrowButton');
    this.leftButton.y = this.game.height - this.leftButton.height;
    this.leftButton.fixedToCamera = true;
    this.rightButton = this.game.add.sprite(this.leftButton.width + 30,0,'arrowButton');
    this.rightButton.y = this.leftButton.y;
    this.rightButton.fixedToCamera = true;
    this.actionButton = this.game.add.sprite(0,0,'actionButton');
    this.actionButton.x = this.game.width - (this.actionButton.width+100);
    this.actionButton.y = this.leftButton.y;
    this.actionButton.fixedToCamera = true;
    this.leftButton.alpha = this.actionButton.alpha = this.rightButton.alpha = 0.7;
  },
  createGoal:function(){
    let data = this.findObjectsByType("goal",this.map,"objectsLayer");
    this.goal = new Goal(this.game,data[0].x,data[0].y,data[0].properties.key,
      data[0].properties.nextLevel);
    this.game.add.existing(this.goal);
    this.game.physics.arcade.enable(this.goal);
  },
  loadLevel:function(){
    this.map = this.game.add.tilemap(this.currentLevel);
    this.map.addTilesetImage("tiles_spritesheet","gameTiles");
    this.backgroundLayer = this.map.createLayer("backgroundLayer");
    this.collisionLayer = this.map.createLayer("collisionLayer");
    this.map.setCollisionBetween(1,160,true,'collisionLayer');
    this.collisionLayer.resizeWorld();
  },
  createEnemy:function(){
    this.enemies = this.game.add.group();
    let enemiesPos = this.findObjectsByType("enemy",this.map,"objectsLayer");
    enemiesPos.forEach(function(element){
      let enemy = new Enemy(this.game,element.x,element.y,'slime',element.velocity,this.map);
      this.enemies.add(enemy);
    },this);
  },
  createPlayer:function(){
    let playerPost = this.findObjectsByType("player",this.map,"objectsLayer");
    this.player = this.game.add.sprite(playerPost[0].x,playerPost[0].y,'player',3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add("walking",[0,1,2,1],6,true);
    this.game.physics.arcade.enable(this.player);
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.game.camera.follow(this.player);
  },
  findObjectsByType:function(targetType,tilemap,layer){
    let result = [];
    tilemap.objects[layer].forEach(function(element){
      if(element.properties.type == targetType){
        element.y -= tilemap.tileHeight;
        result.push(element);
      }
    },this);
    return result;
  },
  update:function(){
    this.game.physics.arcade.collide(this.player,this.collisionLayer);
    this.game.physics.arcade.collide(this.enemies,this.collisionLayer);
    this.game.physics.arcade.collide(this.goal,this.collisionLayer);
    this.game.physics.arcade.overlap(this.player,this.goal,this.nextLevel,null,this);
    this.game.physics.arcade.collide(this.player,this.enemies,this.checkCollision,null,this);
    this.player.body.velocity.x = 0;
    if(this.keys.left.isDown){
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1,1);
      this.player.play("walking");
    }
    else if(this.keys.right.isDown){
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1,1);
      this.player.play("walking");
    }else{
      this.player.animations.stop();
      this.player.frame = 3;
    }
    if(this.keys.up.isDown 
        && (this.player.body.touching.down || this.player.body.blocked.down)){
        this.player.body.velocity.y = -this.JUMPING_SPEED;
    }
  },
  checkCollision:function(player,enemy){
    console.log(enemy.body.touching);
    if(enemy.body.touching.up){
      enemy.kill();
      player.body.velocity.y = -this.BOUNCING_SPEED;
    }else{
      //gameover :v
    }
  },
  nextLevel:function(player,goal){
    this.game.state.start("Game",true,false,goal.nextLevel);
  }
};
