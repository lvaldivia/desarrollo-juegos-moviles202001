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
  console.log("HOLA MUNDO");
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

Board.prototype.populateReserveGrid = function () {};
