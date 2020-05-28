Game = function (game) {};

Game.prototype = {
  init: function () {
    this.NUM_ROWS = 8;
    this.NUM_COLS = 8;
    this.NUM_VARIATIONS = 8;
    this.BLOCK_SIZE = 35;
    this.ANIMATION_TIME = 200;
  },
  create: function () {
    this.backyard = this.game.add.sprite(0, 0, "backyard");
    this.blocks = this.game.add.group();

    this.board = new Board(
      this,
      this.NUM_ROWS,
      this.NUM_COLS,
      this.NUM_VARIATIONS
    );
    this.board.console();
    this.isReversingSwap = false;
    this.isBoardBlocked = false;
    this.selectedBlock = null;
    this.targetBlock = null;
    this.drawBoard();
  },
  drawBoard: function () {
    let i, j, block, square, x, y, data;

    let squareBitmap = this.game.add.bitmapData(
      this.BLOCK_SIZE + 4,
      this.BLOCK_SIZE + 4
    );
    squareBitmap.ctx.fillStyle = "#000";
    squareBitmap.ctx.fillRect(0, 0, this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);

    for (i = 0; i < this.NUM_ROWS; i++) {
      for (j = 0; j < this.NUM_COLS; j++) {
        x = 36 + j * (this.BLOCK_SIZE + 6);
        y = 150 + i * (this.BLOCK_SIZE + 6);

        square = this.add.sprite(x, y, squareBitmap);
        square.anchor.setTo(0.5);
        square.alpha = 0.2;

        this.createBlock(x, y, {
          asset: "bean" + this.board.grid[i][j],
          row: i,
          col: j,
        });
      }
    }
  },
  createBlock: function (posX, posY, data) {
    let block = this.blocks.getFirstExists(false);
    if(!block){
      block = new Block(this, this.ANIMATION_TIME, posX, posY, data);  
      this.blocks.add(block);
    }else{
      block.reset(posX,posY,data);
    }
    block.chooseBlock.add(this.pickBlock,this);
    
    return block;
  },

  getBlockFromColRow:function(position){
    let foundBlock;
    this.blocks.forEachAlive(function(block){
      if(block.row == position.row && block.col == position.col){
        foundBlock = block;
      }
    },this);
    return foundBlock;
  },
  dropBlock : function(sourceRow,targetRow,col){
    let block = this.getBlockFromColRow({row:sourceRow,col:col});
    let targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

    block.row = targetRow;
    let blockMovement = this.add.tween(block);
    blockMovement.to({y:targetY},this.ANIMATION_TIME);
    blockMovement.start();
  },
  dropReserveBlock:function(sourceRow,targetRow,col){
    let x = 35 + col * (this.BLOCK_SIZE + 6);
    let y = (this.BLOCK_SIZE + 6) * this.board.RESERVE_ROW + sourceRow  * (this.BLOCK_SIZE+ 6);
    let block = this.createBlock(x,y,{asset:'block'+this.board.grid[targetRow][col]
                                  , row: targetRow, col:col});

    let targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

    let blockMovement = this.game.add.tween(block);
    blockMovement.to({y:targetY},this.ANIMATION_TIME);
    blockMovement.start();
  },
  swapBlock:function(block1,block2){
    block1.scale.setTo(1);
    let block1Movement = this.game.add.tween(block1);
    block1Movement.to({x:block2.x,y:block2.y},this.ANIMATION_TIME);
    block1Movement.onComplete.add(function(){
      this.board.swap(block1,block2);
      console.log("termino swap1");
      if(!this.isReversingSwap){
        let chains = this.board.findAllChains();
        if(chains.length > 0){
          console.log("hay chains");
          this.updateBoard();
        }else{
          console.log("volver a hacer swap");
          this.isReversingSwap = true;
          this.swapBlock(block1,block2);
        }
      }else{
        console.log("GAAAAA");
        this.isReversingSwap = false;
        this.clearSelection();
      }
    },this);
    block1Movement.start();
    let block2Movement = this.game.add.tween(block2);
    block2Movement.to({x:block1.x,y:block1.y},this.ANIMATION_TIME);
    block2Movement.start();
  },

  pickBlock:function(block){
    if(this.isBoardBlocked){
      return;
    }
    if(!this.selectedBlock){
      block.scale.setTo(1.5);
      this.selectedBlock = block;
    }else{
      this.targetBlock = block;
      if(this.board.checkAdjacent(this.selectedBlock,this.targetBlock)){
        this.isBoardBlocked = true;
        this.swapBlock(this.selectedBlock,this.targetBlock);
      }else{
        this.clearSelection();
      }
    }
  },
  clearSelection:function(){
    this.isBoardBlocked = false;
    this.selectedBlock = null;
    this.blocks.setAll("scale.x",1);
    this.blocks.setAll("scale.y",1);
  },
  updateBoard:function(){
    this.board.clearChains();
    this.board.updateGrid();

    this.game.time.events.add(this.ANIMATION_TIME,function(){
      console.log("llego aca");
      let chains = this.board.findAllChains();
      if(chains.length>0){
        console.log("hay chains en el board");
        this.updateBoard();
      }else{
        this.clearSelection();
      }        
    },this);
  }
};
