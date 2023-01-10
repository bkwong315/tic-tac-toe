const Player = (name, marker) => {
  return { name, marker };
};

const p1 = Player('Brian', 'X');
const p2 = Player('Kevin', 'O');

const board = (() => {
  const boardArr = [];
  let lastEdit = { row: 0, col: 0, player: {} };
  let emptySpace = false;

  for (let row = 0; row < 3; row++) {
    boardArr.push([]);
    for (let col = 0; col < 3; col++) {
      boardArr[row].push('');
    }
  }

  const getBoard = () => boardArr;

  const getCell = (row, col) => boardArr[row][col];

  const setCell = (row, col, player) => {
    boardArr[row][col] = player.marker;
    lastEdit = Object.assign(lastEdit, { row, col, player });
  };

  const getEmptySpace = () => emptySpace;

  const getlastEdit = () => lastEdit;

  const checkGameOver = () => {
    emptySpace = false;

    // Check for empty spaces to determine draw
    // Breaks early if empty space is detected
    for (let row = 0; row < boardArr.length && !emptySpace; row++) {
      for (let col = 0; col < boardArr[row].length && !emptySpace; col++) {
        if (boardArr[row][col] === '') {
          emptySpace = true;
        }
      }
    }

    // Check victory by row
    for (let row = 0; row < boardArr.length; row++) {
      for (let col = 0; col < boardArr[row].length; col++) {
        if (lastEdit.player.marker !== boardArr[row][col]) break;
        if (col + 1 === boardArr.length) return true;
      }
    }

    // Check victory by col
    for (let col = 0; col < boardArr.length; col++) {
      for (let row = 0; row < boardArr[col].length; row++) {
        if (lastEdit.player.marker !== boardArr[row][col]) break;
        if (row + 1 === boardArr.length) return true;
      }
    }

    // Check victory by diagonal
    if (
      (boardArr[0][0] === lastEdit.player.marker &&
        boardArr[1][1] === lastEdit.player.marker &&
        boardArr[2][2] === lastEdit.player.marker) ||
      (boardArr[0][2] === lastEdit.player.marker &&
        boardArr[1][1] === lastEdit.player.marker &&
        boardArr[2][0])
    ) {
      return true;
    }

    if (!emptySpace) return true;

    return false;
  };

  return {
    checkGameOver,
    getBoard,
    setCell,
    getCell,
    getlastEdit,
    getEmptySpace,
  };
})();

const game = (() => {
  const cells = document.querySelectorAll('.cell');
  let currPlayer = p1;
  let gameOver = false;
  const getCurrPlayer = () => currPlayer;
  const getGameOver = () => gameOver;

  cells.forEach((cell) =>
    cell.addEventListener('click', (event) => {
      if (game.getGameOver()) return;

      const row = event.currentTarget.dataset.row;
      const col = event.currentTarget.dataset.col;

      if (board.getCell(row, col) !== '') return;

      let img = document.createElement('img');
      img.draggable = false;

      if (game.getCurrPlayer().marker === 'X') {
        img.src = './imgs/cross.svg';
        img.alt = 'cross';
      } else if (game.getCurrPlayer().marker === 'O') {
        img.src = './imgs/circle.svg';
        img.alt = 'circle';
      }

      event.currentTarget.appendChild(img);
      board.setCell(row, col, game.getCurrPlayer());
      game.endTurn();
    })
  );

  const endTurn = () => {
    if (gameOver) return;

    if (board.checkGameOver()) {
      gameOver = true;
      if (board.getEmptySpace()) {
        alert(`${board.getlastEdit().player.name} wins!`);
      } else {
        alert(`Draw!`);
      }
    }

    if (currPlayer === p1) {
      currPlayer = p2;
    } else {
      currPlayer = p1;
    }
  };

  return { getCurrPlayer, endTurn, getGameOver };
})();
