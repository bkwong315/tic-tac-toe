const Player = (name, marker) => {
  return { name, marker };
};

const p1 = Player('Brian', 'X');
const p2 = Player('Kevin', 'O');

const board = (() => {
  const boardArr = [];
  let lastEdit = { row: 0, col: 0, marker: '' };

  for (let row = 0; row < 3; row++) {
    boardArr.push([]);
    for (let col = 0; col < 3; col++) {
      boardArr[row].push('');
    }
  }

  const getBoard = () => boardArr;

  const getCell = (row, col) => boardArr[row][col];

  const setCell = (row, col, marker) => {
    boardArr[row][col] = marker;
    lastEdit = Object.assign(lastEdit, { row, col, marker });
  };

  const checkWin = () => {
    for (let row = 0; row < boardArr.length; row++) {
      for (let col = 0; col < boardArr[row].length; col++) {
        if (lastEdit.marker !== boardArr[row][col]) break;
        if (col + 1 === boardArr.length) return true;
      }
    }

    for (let col = 0; col < boardArr.length; col++) {
      for (let row = 0; row < boardArr.length; row++) {
        if (lastEdit.marker !== boardArr[row][col]) break;
        if (row + 1 === boardArr.length) return true;
      }
    }

    if (
      (boardArr[0][0] === lastEdit.marker &&
        boardArr[1][1] === lastEdit.marker &&
        boardArr[2][2] === lastEdit.marker) ||
      (boardArr[0][2] === lastEdit.marker &&
        boardArr[1][1] === lastEdit.marker &&
        boardArr[2][0])
    ) {
      return true;
    }

    return false;
  };

  return { checkWin, getBoard, setCell, getCell };
})();

const game = (() => {
  const cells = document.querySelectorAll('.cell');
  let currPlayer = p1;
  const getCurrPlayer = () => currPlayer;

  cells.forEach((cell) =>
    cell.addEventListener('click', (event) => {
      const row = event.currentTarget.dataset.row;
      const col = event.currentTarget.dataset.col;

      if (board.getCell(row, col) !== '') return;

      let img = document.createElement('img');

      if (game.getCurrPlayer().marker === 'X') {
        img.src = './imgs/cross.svg';
        img.alt = 'cross';
      } else if (game.getCurrPlayer().marker === 'O') {
        img.src = './imgs/circle.svg';
        img.alt = 'circle';
      }

      event.currentTarget.appendChild(img);
      board.setCell(row, col, game.getCurrPlayer().marker);
      game.endTurn();
    })
  );

  const endTurn = () => {
    if (board.checkWin()) {
      console.log('You Win!');
    }

    if (currPlayer === p1) {
      currPlayer = p2;
    } else {
      currPlayer = p1;
    }
  };

  return { getCurrPlayer, endTurn };
})();
