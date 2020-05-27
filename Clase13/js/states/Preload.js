Preload = function (game) {};

Preload.prototype = {
  preload: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // trata de centrar horizontalmente
    this.scale.pageAlignHorizontally = true;
    // trata de centrar verticalmente
    this.scale.pageAlignVertically = true;

    this.load.image("backyard", "assets/images/backyard2.png");
    this.load.image("bean1", "assets/images/bean_blue.png");
    this.load.image("bean2", "assets/images/bean_green.png");
    this.load.image("bean3", "assets/images/bean_orange.png");
    this.load.image("bean4", "assets/images/bean_pink.png");
    this.load.image("bean5", "assets/images/bean_purple.png");
    this.load.image("bean6", "assets/images/bean_red.png");
    this.load.image("bean7", "assets/images/bean_white.png");
    this.load.image("bean8", "assets/images/bean_yellow.png");
    this.load.image("beanDead", "assets/images/bean_dead.png");
  },
  create: function () {
    this.state.start("Game");
  },
};
