Board = function (state, rows, cols, blockVariation) {
  this.state = state;
  this.rows = rows;
  this.cols = cols;
  this.blockVariation = blockVariation;
  this.grid = [];

  let i, j;

  for (i = 0; i < rows; i++) {
    this.grid.push([]);
    for (j = 0; j < cols; j++) {
      this.grid[i].push([0]);
    }
  }
  this.reserveGrid = [];

  this.RESERVE_ROW = rows;

  for (i = 0; i < rows; i++) {
    this.reserveGrid.push([]);
    for (j = 0; j < cols; j++) {
      this.reserveGrid[i].push([0]);
    }
  }

  this.populateGrid();
  this.populateReserveGrid();
};

Board.prototype.populateGrid = function () {
  let i, j, variaton;
  for (i = 0; i < this.rows; i++) {
    for (j = 0; j < this.cols; j++) {
      variaton = Math.floor(Math.random() * this.blockVariation) + 1;
      this.grid[i][j] = variaton;
    }
  }
  let chains = this.findAllChains();
  if(chains.length>0){
    this.populateGrid();
  }
};

Board.prototype.console = function () {
  let i, j, prettyString;
  for (i = 0; i < this.rows; i++) {
    prettyString += "\n";
    for (j = 0; j < this.cols; j++) {
      prettyString += " " + this.grid[i][j];
    }
  }
  console.log(prettyString);
};

Board.prototype.populateReserveGrid = function(){
  let i,j,variation;
  for(i = 0; i < this.rows; i++){
    for(j = 0;j < this.cols; j++){
      variation = Math.floor(Math.random()*this.blockVariation) + 1;
      this.reserveGrid[i][j] = variation;
    }
  }
};

Board.prototype.swap = function(source,target){
  let temp = this.grid[target.row][target.col];
  this.grid[target.row][target.col] = this.grid[source.row][source.col];
  this.grid[source.row][source.col] = temp;

  let tempPost = {row:source.row,col:source.col};
  source.col = target.col;
  source.row = target.row;

  target.row = tempPost.row;
  target.col = tempPost.col;
}

Board.prototype.checkAdjacent = function(source,target){
  let diffRow = Math.abs(source.row - target.row);
  let diffCol = Math.abs(source.col - target.col);

  /*let isAdjacent = (diffRow == 1 && diffCol == 0)
                || (diffRow == 0 && diffCol == 1);*/

  let isAdjacent = (diffRow + diffCol == 1);

  return isAdjacent;
}

Board.prototype.isChained = function(block){
  let isChained = false;
  let variation = this.grid[block.row][block.col];
  let row = block.row;
  let col = block.col;

  //izquierda
  if(variation == this.grid[row][col-1] && variation == this.grid[row][col-2]){
    isChained = true;
  }

  //derecha
  if(variation == this.grid[row][col+1] && variation == this.grid[row][col+2]){
    isChained = true;
  }  

  //arriba
  if(this.grid[row-2]){
    if(variation == this.grid[row-1][col] && variation == this.grid[row-2][col]){
      isChained = true;
    }
  }

  //abajo
  if(this.grid[row+2]){
    if(variation == this.grid[row+1][col] && variation == this.grid[row+2][col]){
      isChained = true;
    }
  }
  //centro horizontal
  if(variation == this.grid[row][col - 1] && variation == this.grid[row][col+1]){
    isChained = true;
  }

  //centro vertiacal
  if(this.grid[row+1] && this.grid[row-1]){
    if(variation == this.grid[row+1][col] && variation == this.grid[row-1][col]){
      isChained = true;
    }
  }
  return isChained;
}

Board.prototype.findAllChains = function(){
  let chained = [];
  let i,j;
  for(i=0;i<this.rows;i++){
    for(j = 0;j<this.cols;j++){
      if(this.isChained({row:i,col:j})){
        chained.push({row:i,col:j});
      }
    }
  }
  return chained;
}

Board.prototype.clearChains = function(){
  let chainBlocks = this.findAllChains();
  chainBlocks.forEach(function(block){
    this.grid[block.row][block.col] = 0;
    console.log(block);
    
    this.state.getBlockFromColRow(block).kill();  
    
    //TODO matar block
  },this);
}

Board.prototype.dropBlock = function(sourceRow,targetRow,col){
  this.grid[targetRow][col] = this.grid[sourceRow][col];
  this.grid[sourceRow][col] = 0;
  //TODO dropBlock en game
  this.state.dropBlock(sourceRow, targetRow,col);
}


Board.prototype.dropReservedBlock = function(sourceRow,targetRow,col){
  this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
  this.reserveGrid[sourceRow][col] = 0;
  //TODO dropBlockReserved en game
  this.state.dropReserveBlock(sourceRow, targetRow,col);
}

Board.prototype.updateGrid = function(){
  let i,j,k,foundBlock;

  for(i=this.rows-1;i>=0;i--){
    for(j=0;j<this.cols;j++){
      if(this.grid[i][j] == 0){
        foundBlock = false;
        for(k = i-1;k>=0;k--){
          if(this.grid[k][j] > 0){
            this.dropBlock(k,i,j);
            foundBlock = true;
            break;
          }
        }
        if(!foundBlock){
          for(k=this.RESERVE_ROW-1;k>=0;k--){
            if(this.grid[k][j] > 0){
              this.dropBlock(k,i,j);
              break;
            }
          }
        }
      }
    }
  }
  this.populateReserveGrid();
}


