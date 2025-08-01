import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(200);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[0];

    let newHead;
    switch (direction) {
      case 'RIGHT':
        newHead = [head[0], head[1] + 1];
        break;
      case 'LEFT':
        newHead = [head[0], head[1] - 1];
        break;
      case 'UP':
        newHead = [head[0] - 1, head[1]];
        break;
      case 'DOWN':
        newHead = [head[0] + 1, head[1]];
        break;
      default:
        newHead = head;
    }

    newSnake.unshift(newHead);

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
    } else {
      newSnake.pop();
    }

    if (checkCollision(newHead)) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  const checkCollision = (head) => {
    return (
      head[0] < 0 ||
      head[0] >= 20 ||
      head[1] < 0 ||
      head[1] >= 20 ||
      snake.slice(1).some(segment => segment[0] === head[0] && segment[1] === head[1])
    );
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, speed);

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [snake, direction, gameOver]);

  return (
    <div className="game-area">
      {gameOver ? (
        <div className="game-over">Game Over</div>
      ) : (
        <>
          <div className="food" style={{ gridRowStart: food[0] + 1, gridColumnStart: food[1] + 1 }} />
          {snake.map((segment, index) => (
            <div key={index} className="snake" style={{ gridRowStart: segment[0] + 1, gridColumnStart: segment[1] + 1 }} />
          ))}
        </>
      )}
    </div>
  );
};

export default SnakeGame;