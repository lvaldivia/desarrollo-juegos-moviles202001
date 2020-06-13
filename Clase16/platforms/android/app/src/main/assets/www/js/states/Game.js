Game = function(){}

Game.prototype = {
    init:function(currentLevel){
        this.currentLevel = currentLevel || 1;
        this.numLevels = 3;
        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;
    },
    create:function(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.background = this.game.add.tileSprite(0,0,
                    this.game.world.width,this.game.world.height,"space");
        this.background.autoScroll(0,30);
        this.orchestra = this.game.add.audio("orchestra");
        this.orchestra.play();

        this.player = this.game.add.sprite(this.game.world.centerX, 
                                    this.game.world.height- 50,'player');
        this.game.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5);
        this.player.body.collideWorldBounds = true;
        this.initBullets();
        this.initEnemies();
        this.loadLevel();
    },
    initEnemies:function(){
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;

        this.enemyBullets = this.game.add.group();
        this.enemyBullets.enableBody = true;
    },
    initBullets:function(){

    },
    loadLevel:function(){
        this.currentIndexEnemy = 0;
        this.levelData = JSON.parse(this.game.cache.getText("level"+this.currentLevel));
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000,function(){
            this.orchestra.stop();
            if(this.currentLevel< this.numLevels){
                this.currentLevel++;
            }else{
                this.currentLevel = 1;
            }
            this.game.state.start("Game",true,false,this.currentLevel);
        },this);
        this.scheduleNextEnemy();
    },
    scheduleNextEnemy:function(){
        let nextEnemy = this.levelData.enemies[this.currentIndexEnemy];
        if(nextEnemy){
            let nextTime = 1000*(nextEnemy.time - (this.currentIndexEnemy == 0 ? 0 : 
                                                    this.levelData.enemies[this.currentIndexEnemy-1].time ));
            this.nextEnemyTimer = this.game.time.events.add(nextTime,function(){
                this.createEnemy(nextEnemy.x * this.game.world.width, -100,
                                nextEnemy.health,nextEnemy.key,
                                nextEnemy.scale,nextEnemy.speedX,nextEnemy.speedY)
                this.currentIndexEnemy++;
                this.scheduleNextEnemy();
            },this);                                                    
        }
    },
    createEnemy:function(x,y,health,key,scale,speedX,speedY){
        let enemy = this.enemies.getFirstDead();
        if(!enemy){
            enemy = new Enemy(this.game,x,y,key,health);
            this.enemies.add(enemy);
        }
        enemy.reset(x,y,health,key,scale,speedX,speedY);
    },
    update:function(){
        this.player.body.velocity.x = 0;
        if(this.game.input.activePointer.isDown){
            let targetX = this.game.input.activePointer.position.x;
            let direction = targetX >= this.player.x ? 1 : -1;
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;   
        }
    }


}