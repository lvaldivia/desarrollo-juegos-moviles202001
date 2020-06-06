Video = function (game) {};

Video.prototype = {
  init:function(video_name){
    this.video_name = "video2";
  },
  create:function(){
    
      this.video = this.game.add.video(this.video_name);

      this.video.play(true);

      this.video.addToWorld(400, 300, 0.5, 0.5, 1, 1);
      this.keys = this.game.input.keyboard.createCursorKeys();
      this.video.playbackRate = 0;
      this.delta = 0;
      this.reduce = 200;
      this.playbackRate = 0;
      this.presDelta = 0;
  },
  update:function(){
    this.delta += this.game.time.elapsed;
    if(this.delta>300){
      this.delta = 0;
      this.playbackRate = this.playbackRate > 0.1 ? this.playbackRate - 0.1 : 0;
      console.log(this.playbackRate);
    }
    this.presDelta +=this.game.time.elapsed;
    if(this.keys.up.isDown && this.presDelta >=100){
      this.playbackRate+=0.1;
      if(this.playbackRate > 2){
        this.playbackRate = 2;
      }
      this.presDelta = 0;
    }
    this.video.playbackRate = this.playbackRate;
  }
}