const Player = (name, marker) => {
  return { name, marker };
};

const p1 = Player('Brian', 'X');
const p2 = Player('Kevin', 'O');

const board = (() => {
  const boardArr = [];

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
  };

  return { getBoard, setCell, getCell };
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
    if (currPlayer === p1) {
      currPlayer = p2;
    } else {
      currPlayer = p1;
    }
  };

  return { getCurrPlayer, endTurn };
})();
