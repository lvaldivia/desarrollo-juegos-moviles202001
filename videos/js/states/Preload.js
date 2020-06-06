Preload = function (game) {};

Preload.prototype = {
  preload: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // trata de centrar horizontalmente
    this.scale.pageAlignHorizontally = true;
    // trata de centrar verticalmente
    this.scale.pageAlignVertically = true;

    this.game.load.video('video1', 'assets/videos/video1.mp4');
    this.game.load.video('video2', 'assets/videos/video2.mp4');


  },
  create: function () {
    this.state.start("Game");
  },
};
