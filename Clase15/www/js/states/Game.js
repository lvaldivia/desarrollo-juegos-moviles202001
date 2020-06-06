Game = function (game) {};

Game.prototype = {
  init:function(level){
    this.currentLevel = level || "level0";
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED  = 500;
    this.BOUNCING_SPEED = 150;
  },
  create:function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
    
    this.loadLevel();
    this.createPlayer();
    this.createEnemy();
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
      console.log(element);
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
  }
};
