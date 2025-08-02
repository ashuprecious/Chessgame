import React, { useState } from 'react';
import './App.css';

const initialBoard = [
  ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR'],
];

const pieceUnicode = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

// /gghhvsyhgdysagdyasgd

function isWhite(piece) {
  return piece && piece[0] === 'w';
}
function isBlack(piece) {
  return piece && piece[0] === 'b';
}

function getPossibleMoves(board, from, turn) {
  const [fx, fy] = from;
  const piece = board[fx][fy];
  if (!piece) return [];
  const type = piece[1];
  const moves = [];
  const directions = {
    N: [-1, 0], S: [1, 0], E: [0, 1], W: [0, -1],
    NE: [-1, 1], NW: [-1, -1], SE: [1, 1], SW: [1, -1],
  };
  const enemy = turn === 'w' ? isBlack : isWhite;

  // Helper to add move if valid
  const add = (x, y) => {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false;
    if (!board[x][y]) { moves.push([x, y]); return true; }
    if (enemy(board[x][y])) { moves.push([x, y]); }
    return false;
  };

  if (type === 'P') {
    const dir = turn === 'w' ? -1 : 1;
    // Forward
    if (!board[fx + dir]?.[fy]) add(fx + dir, fy);
    // Double move from start
    if ((turn === 'w' && fx === 6) || (turn === 'b' && fx === 1)) {
      if (!board[fx + dir]?.[fy] && !board[fx + 2 * dir]?.[fy]) add(fx + 2 * dir, fy);
    }
    // Captures
    if (enemy(board[fx + dir]?.[fy - 1])) add(fx + dir, fy - 1);
    if (enemy(board[fx + dir]?.[fy + 1])) add(fx + dir, fy + 1);
  }
  if (type === 'N') {
    [
      [fx-2, fy-1], [fx-2, fy+1], [fx-1, fy-2], [fx-1, fy+2],
      [fx+1, fy-2], [fx+1, fy+2], [fx+2, fy-1], [fx+2, fy+1]
    ].forEach(([x, y]) => {
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && (!board[x][y] || enemy(board[x][y]))) {
        moves.push([x, y]);
      }
    });
  }
  if (type === 'B' || type === 'Q') {
    // Diagonals
    for (const [dx, dy] of [[-1,-1],[1,1],[-1,1],[1,-1]]) {
      let x = fx + dx, y = fy + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        if (!add(x, y)) break;
        if (board[x][y]) break;
        x += dx; y += dy;
      }
    }
  }
  if (type === 'R' || type === 'Q') {
    // Straights
    for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      let x = fx + dx, y = fy + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        if (!add(x, y)) break;
        if (board[x][y]) break;
        x += dx; y += dy;
      }
    }
  }
  if (type === 'K') {
    for (const [dx, dy] of Object.values(directions)) {
      const x = fx + dx, y = fy + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && (!board[x][y] || enemy(board[x][y]))) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}

function App() {
  const [board, setBoard] = useState(initialBoard.map(row => [...row]));
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('w');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [status, setStatus] = useState('White\'s turn');

  const handleSquareClick = (x, y) => {
    const piece = board[x][y];
    if (selected) {
      // If clicked on a possible move, move the piece
      if (possibleMoves.some(([mx, my]) => mx === x && my === y)) {
        const newBoard = board.map(row => [...row]);
        newBoard[x][y] = board[selected[0]][selected[1]];
        newBoard[selected[0]][selected[1]] = null;
        setBoard(newBoard);
        setSelected(null);
        setPossibleMoves([]);
        const nextTurn = turn === 'w' ? 'b' : 'w';
        setTurn(nextTurn);
        setStatus(nextTurn === 'w' ? "White's turn" : "Black's turn");
        return;
      }
      // If clicked on another own piece, select it
      if (piece && ((turn === 'w' && isWhite(piece)) || (turn === 'b' && isBlack(piece)))) {
        setSelected([x, y]);
        setPossibleMoves(getPossibleMoves(board, [x, y], turn));
        return;
      }
      // Otherwise, deselect
      setSelected(null);
      setPossibleMoves([]);
    } else {
      // Select own piece
      if (piece && ((turn === 'w' && isWhite(piece)) || (turn === 'b' && isBlack(piece)))) {
        setSelected([x, y]);
        setPossibleMoves(getPossibleMoves(board, [x, y], turn));
      }
    }
  };

  const handleReset = () => {
    setBoard(initialBoard.map(row => [...row]));
    setSelected(null);
    setPossibleMoves([]);
    setTurn('w');
    setStatus("White's turn");
  };

  return (
    <div className="chess-container">
      <h1 className="chess-title">Chess Game</h1>
      <div className="chess-status">{status}</div>
      <div className="chess-board">
        {board.map((row, x) =>
          row.map((piece, y) => {
            const isSelected = selected && selected[0] === x && selected[1] === y;
            const isPossible = possibleMoves.some(([mx, my]) => mx === x && my === y);
            const isWhiteSquare = (x + y) % 2 === 1;
            return (
              <div
                key={x + '-' + y}
                className={
                  'chess-square' +
                  (isWhiteSquare ? ' white' : ' black') +
                  (isSelected ? ' selected' : '') +
                  (isPossible ? ' possible' : '')
                }
                onClick={() => handleSquareClick(x, y)}
              >
                {piece ? <span className={'piece ' + (isWhite(piece) ? 'white-piece' : 'black-piece')}>{pieceUnicode[piece]}</span> : null}
                {isPossible && !board[x][y] && <span className="move-dot"></span>}
              </div>
            );
          })
        )}
      </div>
      <button className="chess-reset-btn" onClick={handleReset}>Reset Game</button>
      <div className="chess-instructions">
        Click a piece to select, then click a highlighted square to move.<br />
        Only basic moves are supported (no check/checkmate/castling/promotion).
      </div>
    </div>
  );
}

export default App;
