Block = function (game, animationTime, x, y, data) {
  Phaser.Sprite.call(this, game, x, y, data.asset);
  this.animationTime = animationTime;
  this.row = data.row;
  this.col = data.col;
  this.anchor.setTo(0.5);

  this.inputEnabled = true;
  this.events.onInputDown.add(this.pickBlock,this);
  this.chooseBlock = new Phaser.Signal();
};

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

Block.prototype.pickBlock = function(){
  this.chooseBlock.dispatch();
}

Block.prototype.reset = function (x, y, data) {
  Sprite.prototype.reset.call(this, x, y);
  this.loadTexture(data.asset);
  this.row = data.row;
  this.col = data.col;
};

Block.prototype.kill = function () {
  this.loadTexture("beanDead");
  this.col = null;
  this.row = null;

  this.game.time.event.add(
    this.animationTime * 2,
    function () {
      Phaser.Sprite.kill.call();
    },
    this
  );
};
