import { useEffect, useState, useCallback } from 'react';
import './App.css';
import cross from './images/cross.png';
import o from './images/o.png';
import SideSelection from './components/SideSelection';
import GameOver from './components/GameOver';
import { motion } from 'framer-motion';

function App() {
  const [playerSide, setPlayerSide] = useState('');
  const [computerSide, setComputerSide] = useState('');
  const [grid, setGrid] = useState(Array(9).fill(null));
  const [gameOn, setGameOn] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [winCombinationIndex, setWinCombinationIndex] = useState(null);
  const [gameReset, setGameReset] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [isHardMode, setIsHardMode] = useState(false);

  const GameReset = () => {
    setGrid(Array(9).fill(null));
    setGameOn(true);
    setShowGameOver(false);
    setWinner('');
    setWinCombinationIndex(null);
    setGameReset(false);
    setPlayerSide('');
    setWinningCells([]);
  };
  const handleCheckboxChange = () => {
    setIsHardMode(!isHardMode);
};
console.log(isHardMode)

  useEffect(() => {
    if (gameReset) {
      GameReset();
    }
  }, [gameReset]);

  useEffect(() => {
    if (playerSide) {
      setComputerSide(playerSide === 'X' ? 'O' : 'X');
    }
  }, [playerSide]);

  const playerSideHandle = (side) => {
    setPlayerSide(side);
  };

  const handleClick = (index) => {
    if (!gameOn || grid[index] !== null) {
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = playerSide;
    setGrid(newGrid);

    const { winner, winningLine, newCell } = checkGameOver(newGrid);

    if (winner) {
      if (winner !== 'D') {
        setWinningCells(newCell);
        setWinner(winner);
        setTimeout(() => setWinCombinationIndex(winningLine), 800);
      }
      setWinner(winner);
      setTimeout(() => setShowGameOver(true), 3000);
      setGameOn(false);
      return;
    }

    setTimeout(() => {
      if (gameOn) {
        if(isHardMode){
          const bestMove = findBestMove(newGrid, computerSide);
          console.log(bestMove, computerSide)
          if (bestMove !== -1) {
            const updatedGrid = [...newGrid];
            updatedGrid[bestMove] = computerSide;
            setGrid(updatedGrid);
    
            const { winner, winningLine, newCell } = checkGameOver(updatedGrid);
    
            if (winner) {
              if (winner !== 'D') {
                setWinningCells(newCell);
                setWinner(winner);
                setTimeout(() => setWinCombinationIndex(winningLine), 800);
              }
              setTimeout(() => setShowGameOver(true), 3000);
              setGameOn(false);
            }
          }
        }else{
          computerClick(newGrid);
        }
      
       
      
      }
    }, 1000);
  };

 
  


  const computerClick = useCallback(
    (currentGrid) => {
      if (!gameOn) {
        return;
      }

      const emptyIndices = currentGrid
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null);

      if (emptyIndices.length > 0) {
        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newGrid = [...currentGrid];
        newGrid[randomIndex] = computerSide;
        setGrid(newGrid);

        const { winner, winningLine, newCell } = checkGameOver(newGrid);

        if (winner) {
          if (winner !== 'D') {
            setWinningCells(newCell);
            setWinner(winner);
            setTimeout(() => setWinCombinationIndex(winningLine), 800);
          }
          setWinner(winner);
          setTimeout(() => setShowGameOver(true), 3000);
          setGameOn(false);
          return;
        }
      }
    },
    [gameOn, computerSide]
  );

  const findBestMove = (grid, player) => {
    let bestScore = -Infinity;
    let move = -1;
  
    console.log('Finding best move for player', player);
  
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === null) {
        console.log('Considering move', i);
        grid[i] = player;
        let score = minimax(grid, 0, false, player);
        grid[i] = null;
        console.log('Score for move', i, 'is', score);
        if (score > bestScore) {
          bestScore = score;
          move = i;
          console.log('New best move is', move, 'with score', bestScore);
        }
      }
    }
    console.log('Best move is', move);
    return move;
  };

  const minimax = (grid, depth, isMaximizing, player) => {
    // Define scores based on the player ('X' or 'O')
    const scores = {
      X: {
        X: 10,  // Score for 'X' (computer) when 'X' wins
        O: -1,  // Score for 'X' (computer) when 'O' wins
        D: 0    // Score for 'X' (computer) when it's a draw
      },
      O: {
        X: -10, // Score for 'O' (player) when 'X' wins
        O: 1,   // Score for 'O' (player) when 'O' wins
        D: 0    // Score for 'O' (player) when it's a draw
      },
      D: {
        X: 0,   // Score for draw when 'X' (computer) is playing
        O: 0,   // Score for draw when 'O' (player) is playing
        D: 0    // Score for draw when it's a draw
      }
    };
  
    const { winner } = checkGameOver(grid);
    if (winner !== null) {
      return scores[player][winner]; // Return score based on player and winner
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === null) {
          grid[i] = computerSide; // Assuming 'X' is the maximizing player
          let score = minimax(grid, depth + 1, false, player);
          grid[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === null) {
          grid[i] = playerSide; // Assuming 'O' is the minimizing player
          let score = minimax(grid, depth + 1, true, player);
          grid[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };
  


  const checkGameOver = (currentGrid) => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        const newCell = [a, b, c];
        if (currentGrid[a] && currentGrid[a] === currentGrid[b] && currentGrid[a] === currentGrid[c]) {
            return { winner: currentGrid[a], winningLine: i, newCell: newCell };
        }
    }

    if (!currentGrid.includes(null)) {
        return { winner: 'D', winningLine: null, newCell: null }; // Draw
    }

    return { winner: null, winningLine: null, newCell: null }; // Game still ongoing
};


  const getWinningLineStyle = (combinationIndex, winner) => {
    const color = winner === 'X' ? '#4281f8' : '#f99d17';
    const isSmallScreen = window.innerWidth < 600;

    const smallScreenStyles = {
      horizontalTop: {
        top: '17.5%',
        left: '7.5%',
        width: '90%',
      },
      horizontalMiddle: {
        top: '47.2%',
        left: '7.5%',
        width: '90%',
      },
      horizontalBottom: {
        top: '76.8%',
        left: '7.5%',
        width: '90%',
      },
      verticalLeft: {
        top: '7.5%',
        left: '18.5%',
        width: '12px',
        height: '90%',
      },
      verticalMiddle: {
        top: '7.5%',
        left: '48%',
        width: '12px',
        height: '90%',
      },
      verticalRight: {
        top: '7.55%',
        left: '78%',
        width: '12px',
        height: '90%',
      },
      diagonalTopLeftBottomRight: {
        top: '6.5%',
        left: '10.5%',
        width: '100%',
        transform: 'rotate(45deg)',
        transformOrigin: 'left top',
      },
      diagonalTopRightBottomLeft: {
        top: '10.5%',
        left: '93.5%',
        width: '100%',
        transform: 'rotate(135deg)',
        transformOrigin: 'left top',
      },
    };

    const largeScreenStyles = {
      horizontalTop: {
        top: '17.2%',
        left: '7.5%',
        width: '85%',
      },
      horizontalMiddle: {
        top: '48.2%',
        left: '7.5%',
        width: '85%',
      },
      horizontalBottom: {
        top: '79.2%',
        left: '7.5%',
        width: '85%',
      },
      verticalLeft: {
        top: '7.5%',
        left: '17.2%',
        width: '18px',
        height: '85%',
      },
      verticalMiddle: {
        top: '7.5%',
        left: '48.2%',
        width: '18px',
        height: '85%',
      },
      verticalRight: {
        top: '7.5%',
        left: '79.2%',
        width: '18px',
        height: '85%',
      },
      diagonalTopLeftBottomRight: {
        top: '7.5%',
        left: '10%',
        width: '117%',
        transform: 'rotate(45deg)',
        transformOrigin: 'left top',
      },
      diagonalTopRightBottomLeft: {
        top: '9.5%',
        left: '93%',
        width: '117%',
        transform: 'rotate(135deg)',
        transformOrigin: 'left top',
      },
    };

    const styles = isSmallScreen ? smallScreenStyles : largeScreenStyles;

    switch (combinationIndex) {
      case 0: // Top horizontal
        return {
          className: 'horizontal',
          style: {
            ...styles.horizontalTop,
            backgroundColor: color,
          },
        };
      case 1: // Middle horizontal
        return {
          className: 'horizontal',
          style: {
            ...styles.horizontalMiddle,
            backgroundColor: color,
          },
        };
      case 2: // Bottom horizontal
        return {
          className: 'horizontal',
          style: {
            ...styles.horizontalBottom,
            backgroundColor: color,
          },
        };
      case 3: // Left vertical
        return {
          className: 'vertical',
          style: {
            ...styles.verticalLeft,
            backgroundColor: color,
          },
        };
      case 4: // Middle vertical
        return {
          className: 'vertical',
          style: {
            ...styles.verticalMiddle,
            backgroundColor: color,
          },
        };
      case 5: // Right vertical
        return {
          className: 'vertical',
          style: {
            ...styles.verticalRight,
            backgroundColor: color,
          },
        };
      case 6: // Top-left to bottom-right diagonal
        return {
          className: 'diagonal',
          style: {
            ...styles.diagonalTopLeftBottomRight,
            backgroundColor: color,
          },
        };
      case 7: // Top-right to bottom-left diagonal
        return {
          className: 'diagonal',
          style: {
            ...styles.diagonalTopRightBottomLeft,
            backgroundColor: color,
          },
        };
      default:
        return { className: '', style: {} };
    }
  };
  

  const getScaleValue = () => (window.innerWidth < 600 ? 1.3 : 1.2);

  return playerSide ? (
    !showGameOver ? (
      <div className="App">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="gameMode">
          <div className="gameMode">
            <input type="checkbox" name="gameMode" id="gameMode" checked={isHardMode} onChange={handleCheckboxChange}/>
            <label htmlFor="gameMode" >
            <svg className='ai' fill="#000000" width="800px" height="800px" viewBox="0 0 35 35" data-name="Layer 2" id="e73e2821-510d-456e-b3bd-9363037e93e3" xmlns="http://www.w3.org/2000/svg"><path d="M11.933,15.055H3.479A3.232,3.232,0,0,1,.25,11.827V3.478A3.232,3.232,0,0,1,3.479.25h8.454a3.232,3.232,0,0,1,3.228,3.228v8.349A3.232,3.232,0,0,1,11.933,15.055ZM3.479,2.75a.73.73,0,0,0-.729.728v8.349a.73.73,0,0,0,.729.728h8.454a.729.729,0,0,0,.728-.728V3.478a.729.729,0,0,0-.728-.728Z"/><path d="M11.974,34.75H3.52A3.233,3.233,0,0,1,.291,31.521V23.173A3.232,3.232,0,0,1,3.52,19.945h8.454A3.232,3.232,0,0,1,15.2,23.173v8.348A3.232,3.232,0,0,1,11.974,34.75ZM3.52,22.445a.73.73,0,0,0-.729.728v8.348a.73.73,0,0,0,.729.729h8.454a.73.73,0,0,0,.728-.729V23.173a.729.729,0,0,0-.728-.728Z"/><path d="M31.522,34.75H23.068a3.233,3.233,0,0,1-3.229-3.229V23.173a3.232,3.232,0,0,1,3.229-3.228h8.454a3.232,3.232,0,0,1,3.228,3.228v8.348A3.232,3.232,0,0,1,31.522,34.75Zm-8.454-12.3a.73.73,0,0,0-.729.728v8.348a.73.73,0,0,0,.729.729h8.454a.73.73,0,0,0,.728-.729V23.173a.729.729,0,0,0-.728-.728Z"/><path d="M27.3,15.055a7.4,7.4,0,1,1,7.455-7.4A7.437,7.437,0,0,1,27.3,15.055Zm0-12.3a4.9,4.9,0,1,0,4.955,4.9A4.935,4.935,0,0,0,27.3,2.75Z"/></svg>
              <svg
                className="multiplayer"
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V4H20C21.6569 4 23 5.34315 23 7V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V7C1 5.34315 2.34315 4 4 4H11V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM4 6H11H13H20C20.5523 6 21 6.44772 21 7V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6ZM15 11.5C15 10.6716 15.6716 10 16.5 10C17.3284 10 18 10.6716 18 11.5C18 12.3284 17.3284 13 16.5 13C15.6716 13 15 12.3284 15 11.5ZM16.5 8C14.567 8 13 9.567 13 11.5C13 13.433 14.567 15 16.5 15C18.433 15 20 13.433 20 11.5C20 9.567 18.433 8 16.5 8ZM7.5 10C6.67157 10 6 10.6716 6 11.5C6 12.3284 6.67157 13 7.5 13C8.32843 13 9 12.3284 9 11.5C9 10.6716 8.32843 10 7.5 10ZM4 11.5C4 9.567 5.567 8 7.5 8C9.433 8 11 9.567 11 11.5C11 13.433 9.433 15 7.5 15C5.567 15 4 13.433 4 11.5ZM10.8944 16.5528C10.6474 16.0588 10.0468 15.8586 9.55279 16.1056C9.05881 16.3526 8.85858 16.9532 9.10557 17.4472C9.68052 18.5971 10.9822 19 12 19C13.0178 19 14.3195 18.5971 14.8944 17.4472C15.1414 16.9532 14.9412 16.3526 14.4472 16.1056C13.9532 15.8586 13.3526 16.0588 13.1056 16.5528C13.0139 16.7362 12.6488 17 12 17C11.3512 17 10.9861 16.7362 10.8944 16.5528Z"
                />
              </svg>

              
            </label>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ scale: 3 }}
          transition={{ duration: 1 }}>
          <div className="gameBody">
            {winCombinationIndex !== null && (
              <div
                className={`winnerLine ${
                  getWinningLineStyle(winCombinationIndex, winner).className
                }`}
                style={
                  getWinningLineStyle(winCombinationIndex, winner).style
                }></div>
            )}
            {grid.map((value, index) => (
              <motion.div
                key={index}
                initial={{ scale: 1 }}
                animate={
                  winningCells.includes(index)
                    ? { scale: getScaleValue() }
                    : { scale: 1 }
                }
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`tacPlace ${value ? '' : 'active'}`}
                onClick={() => handleClick(index)}>
                {value && <img src={value === 'X' ? cross : o} alt={value} />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    ) : (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="gameOver">
        <GameOver winner={winner} setGameReset={setGameReset} />
      </motion.div>
    )
  ) : (
    <motion.div
      key={playerSide}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="playerSide">
      <SideSelection playerSideHandle={playerSideHandle} />
    </motion.div>
  );
}

export default App;
