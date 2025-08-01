import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = () => {
    const head = snake[0];
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

    const newSnake = [newHead, ...snake];

    if (newHead[0] < 0 || newHead[0] >= 20 || newHead[1] < 0 || newHead[1] >= 20 || newSnake.slice(1).some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
      setGameOver(true);
      return;
    }

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 100);

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
          {snake.map((segment, index) => (
            <div key={index} className="snake" style={{ top: segment[0] * 20, left: segment[1] * 20 }} />
          ))}
          <div className="food" style={{ top: food[0] * 20, left: food[1] * 20 }} />
        </>
      )}
    </div>
  );
};

export default SnakeGame;