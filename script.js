const Player = (name, marker) => {
  return { name, marker };
};

const p1 = Player('Brian', 'X');
const p2 = Player('Kevin', 'O');

const Board = () => {
  const board = [];

  const getBoard = () => board;

  const getCell = (row, col) => board[row][col];

  const setCell = (row, col, marker) => {
    board[row][col] = marker;
  };

  for (let row = 0; row < 3; row++) {
    board.push([]);
    for (let col = 0; col < 3; col++) {
      board[row].push('');
    }
  }

  return { getBoard, setCell, getCell };
};

const board = Board();
board.setCell(0, 2, 'X');
console.log(board.getCell(0, 2));
console.table(board.getBoard());
