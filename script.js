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

board.setCell(0, 2, 'X');
console.log(board.getCell(0, 2));
console.table(board.getBoard());
