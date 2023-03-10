const p1MarkerCheckbox = document.querySelector('#p1-marker');
const p2MarkerCheckbox = document.querySelector('#p2-marker');

p1MarkerCheckbox.addEventListener('click', (event) => {
  if (p1MarkerCheckbox.checked === true) p2MarkerCheckbox.checked = false;
  else p2MarkerCheckbox.checked = true;
});

p2MarkerCheckbox.addEventListener('click', (event) => {
  if (p2MarkerCheckbox.checked === true) p1MarkerCheckbox.checked = false;
  else p1MarkerCheckbox.checked = true;
});

const Player = (name, marker) => {
  return { name, marker };
};

const startBtn = document.querySelector('.start-btn');

startBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const p1Name = document.querySelector('#p1-name');
  const p2Name = document.querySelector('#p2-name');
  const form = document.querySelector('form');

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  let p1 = {};
  let p2 = {};
  let p1Marker;
  let p2Marker;

  if (p1MarkerCheckbox.checked) {
    p1Marker = 'X';
    p2Marker = 'O';
  } else {
    p1Marker = 'O';
    p2Marker = 'X';
  }

  p1 = Player(p1Name.value, p1Marker);
  p2 = Player(p2Name.value, p2Marker);

  form.style.display = 'none';
  game.startGame(p1, p2);
});

const restartBtn = document.querySelector('.restart-btn');

restartBtn.addEventListener('click', () => {
  game.restartGame();
});

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

  const getLastEdit = () => lastEdit;

  const reset = () => {
    for (let row = 0; row < boardArr.length; row++) {
      for (let col = 0; col < boardArr.length; col++) {
        boardArr[row][col] = '';
      }
    }

    lastEdit = { row: 0, col: 0, player: {} };
  };

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
        if (col + 1 === boardArr.length) {
          console.log('Row Win');
          emptySpace = true;
          return true;
        }
      }
    }

    // Check victory by col
    for (let col = 0; col < boardArr.length; col++) {
      for (let row = 0; row < boardArr[col].length; row++) {
        if (lastEdit.player.marker !== boardArr[row][col]) break;
        if (row + 1 === boardArr.length) {
          console.log('Col Win');
          emptySpace = true;
          return true;
        }
      }
    }

    // Check victory by diagonal
    if (
      (boardArr[0][0] === lastEdit.player.marker &&
        boardArr[1][1] === lastEdit.player.marker &&
        boardArr[2][2] === lastEdit.player.marker) ||
      (boardArr[0][2] === lastEdit.player.marker &&
        boardArr[1][1] === lastEdit.player.marker &&
        boardArr[2][0] === lastEdit.player.marker)
    ) {
      console.log('Diag Win');
      emptySpace = true;
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
    getLastEdit,
    getEmptySpace,
    reset,
  };
})();

const game = (() => {
  const cells = document.querySelectorAll('.cell');
  let currPlayer = {};
  let gameOver = false;
  let p1;
  let p2;

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
      img.style.height = '100%';

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

  const startGame = (player1, player2) => {
    const gameDisplay = document.querySelector('.game-display');

    p1 = player1;
    p2 = player2;
    currPlayer = p1;
    gameDisplay.style.display = 'grid';

    let currName = currPlayer.name;
    if (currName > 10) currName = currName.slice(0, 10);

    updateInfoDisplay(`${currName}'s Turn`);
  };

  const updateInfoDisplay = (displayedText) => {
    document.querySelector('.info-display').textContent = displayedText;
  };

  const restartGame = () => {
    board.reset();
    gameOver = false;
    currPlayer = p1;

    cells.forEach((cell) => {
      if (cell.children.length > 0) cell.removeChild(cell.children[0]);
    });

    let currName = currPlayer.name;
    if (currName > 10) currName = currName.slice(0, 10);

    updateInfoDisplay(`${currName}'s Turn`);
    restartBtn.style.visibility = 'hidden';
  };

  const endTurn = () => {
    if (gameOver) return;

    let displayedText;
    let currName = currPlayer.name;
    if (currName > 10) currName = currName.slice(0, 10);

    if (board.checkGameOver()) {
      gameOver = true;

      if (board.getEmptySpace()) {
        currName = board.getLastEdit().player.name;
        if (currName > 10) currName = currName.slice(0, 10);

        displayedText = `${currName} wins!`;
      } else {
        displayedText = `Draw!`;
      }

      updateInfoDisplay(displayedText);
      restartBtn.style.visibility = 'visible';
      return;
    }

    if (currPlayer === p1) {
      currPlayer = p2;
    } else {
      currPlayer = p1;
    }

    displayedText = `${currName}'s Turn`;

    updateInfoDisplay(displayedText);
  };

  return { getCurrPlayer, endTurn, getGameOver, startGame, restartGame };
})();
