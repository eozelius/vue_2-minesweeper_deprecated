export const flagAllMines = wrapper => {
  if (wrapper === undefined) {
    throw new Error("Board.spec.js::flagAllMinesWrapper requires a wrapper");
  }

  for (let r = 0; r < wrapper.vm.rows; r++) {
    for (let c = 0; c < wrapper.vm.cols; c++) {
      if (wrapper.vm.board[r][c].mine) {
        wrapper.vm.board[r][c].flag = true;
      }
    }
  }
};

export const findMine = wrapper => {
  if (wrapper === undefined) {
    throw new Error("Board.spec.js::findMine() Must be passed a wrapper");
  }

  for (let r = 0; r < wrapper.vm.rows; r++) {
    for (let c = 0; c < wrapper.vm.cols; c++) {
      if (wrapper.vm.board[r][c].mine) {
        return {
          row: r,
          col: c
        };
      }
    }
  }
};

export const winGame = wrapper => {
  if (wrapper === undefined) {
    throw new Error("Board.spec.js::winGame() Must be passed a wrapper");
  }

  wrapper.vm.safeCells = 0;
  flagAllMines(wrapper);
};

export const activateAllCells = wrapper => {
  if (wrapper === undefined) {
    throw new Error("Board.spec.js::winGame() Must be passed a wrapper");
  }
  for (let r = 0; r < wrapper.vm.rows; r++) {
    for (let c = 0; c < wrapper.vm.cols; c++) {
      wrapper.vm.board[r][c].active = true;
    }
  }
};
