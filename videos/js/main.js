window.onload = function () {
  let game = new Phaser.Game(1920, 1080, Phaser.AUTO);
  //nombre del diccionario, nombra de la clase
  game.state.add("Preload", Preload);
  game.state.add("Game", Game);
  game.state.add("Video", Video);
  game.state.start("Preload");
};
