Game = function (game) {};

Game.prototype = {
  create:function(){
    var drawnObject;
    var width = 300 // example;
    var height = 300 // example;
    var bmd = this.game.add.bitmapData(width, height);
    for(var i=0;i<2;i++){
      
       
      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, width, height);
      bmd.ctx.fillStyle = '#ffffff';
      bmd.ctx.fill();
      drawnObject = this.game.add.sprite(i*(width+100),100, bmd);
      drawnObject.inputEnabled = true;
      drawnObject.video = i+1;
      drawnObject.events.onInputDown.add(this.goVideo,this);
    }

  },
  goVideo:function(sprite){
    this.state.start("Video",true,false,sprite.video);
  }
}