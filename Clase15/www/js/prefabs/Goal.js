Goal = function(game,x,y,key,nextLevel){
    Phaser.Sprite.call(this,game,x,y,key);
    this.game = game;
    this.nextLevel = nextLevel;
}

Goal.prototype = Object.create(Phaser.Sprite.prototype);
Goal.prototype.constructor = Goal;

