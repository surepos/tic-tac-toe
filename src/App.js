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

  const GameReset = () => {
    setGrid(Array(9).fill(null));
    setGameOn(true);
    setShowGameOver(false);
    setWinner('');
    setWinCombinationIndex(null);
    setGameReset(false);
    setPlayerSide('');
    setWinningCells([])
  };
  if (gameReset) {
    GameReset();
  }
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

    if (checkGameOver(newGrid)) {
      setGameOn(false); // Update gameOn state to false
      return;
    }

    setTimeout(() => {
      if (gameOn) {
        computerClick(newGrid);
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

        if (checkGameOver(newGrid)) {
          setGameOn(false); 
        }
      }
    },
    [gameOn, computerSide]
  );

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
  
      if (
        currentGrid[a] &&
        currentGrid[a] === currentGrid[b] &&
        currentGrid[a] === currentGrid[c]
      ) {
        const newCell = [a, b, c];
        setWinningCells(newCell)
        setWinner(currentGrid[a]);
        setTimeout(() => setWinCombinationIndex(i), 800);
        ;
        setTimeout(() => setShowGameOver(true), 3000);
        return true; 
      }
    }

    if (!currentGrid.includes(null)) {
      setWinner('D');
      setTimeout(() => setShowGameOver(true), 3000);
      return true; // Game over, return true
    }

    return false; // Game still ongoing, return false
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

const getScaleValue = () => window.innerWidth < 600 ? 1.3 : 1.2;


  return playerSide ? (
    !showGameOver ? (
      <div className="App">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay:0.5 }}
          className="gameMode">
          <div className="gameMode">
            <input type="checkbox" name="gameMode" id="gameMode" />
            <label htmlFor="gameMode">
              <svg
                className="ai"
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

              <svg
                className="multiplayer"
                fill="#000000"
                height="800px"
                width="800px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 468.493 468.493"
                xmlSpace="preserve">
                <g>
                  <path
                    d="M138.321,161.831h-17.437v-17.437c0-3.615-2.287-6.835-5.701-8.026c-5.319-1.855-10.904-2.796-16.6-2.796
		c-5.696,0-11.281,0.941-16.6,2.796c-3.414,1.191-5.701,4.411-5.701,8.026v17.437H58.847c-3.615,0-6.834,2.287-8.025,5.7
		c-1.856,5.318-2.797,10.904-2.797,16.601s0.941,11.283,2.797,16.601c1.191,3.413,4.411,5.699,8.025,5.699h17.437v17.437
		c0,3.615,2.287,6.834,5.7,8.025c5.318,1.856,10.904,2.797,16.601,2.797c5.697,0,11.283-0.941,16.601-2.797
		c3.413-1.191,5.7-4.41,5.7-8.025v-17.437h17.437c3.615,0,6.835-2.287,8.026-5.7c1.855-5.318,2.796-10.903,2.796-16.6
		c0-5.696-0.941-11.281-2.796-16.6C145.156,164.118,141.937,161.831,138.321,161.831z M131.729,189.432h-19.344
		c-4.694,0-8.5,3.806-8.5,8.5v19.344c-3.481,0.553-7.12,0.552-10.601,0v-19.344c0-4.694-3.806-8.5-8.5-8.5H65.44
		c-0.276-1.741-0.415-3.511-0.415-5.3s0.139-3.56,0.415-5.301h19.344c4.694,0,8.5-3.806,8.5-8.5v-19.343
		c3.482-0.553,7.12-0.553,10.601,0v19.343c0,4.694,3.806,8.5,8.5,8.5h19.343c0.276,1.741,0.415,3.511,0.415,5.301
		C132.143,185.921,132.004,187.692,131.729,189.432z"
                  />
                  <path
                    d="M254.329,166.478c0.009,0,0.019,0,0.028,0c7.996-0.009,14.459-6.501,14.44-14.497c-0.02-7.987-6.501-14.449-14.497-14.439
		c-7.987,0.019-14.459,6.511-14.439,14.497C239.879,160.025,246.351,166.478,254.329,166.478z"
                  />
                  <path
                    d="M413.655,176.853c-15.05-16.238-39.613-18.106-57.137-4.34c-4.789,3.762-10.376,6.982-16.534,9.625
		c-6.765-39.084-24.521-74.946-51.786-104.346c-15.049-16.24-39.611-18.11-57.141-4.344c-14.5,11.397-36.2,17.934-59.535,17.934
		c-23.341,0-45.044-6.537-59.545-17.935C94.463,59.683,69.9,61.551,54.838,77.791C19.475,115.946,0,165.618,0,217.657
		c0,19.499,2.732,38.81,8.122,57.398c3.94,13.584,14.402,24.161,27.984,28.293c4.044,1.23,8.175,1.833,12.271,1.833
		c9.678,0,19.154-3.365,26.782-9.76c16.623-13.948,35.986-24.059,56.702-29.731c-4.216,16.521-6.402,33.645-6.402,51.037
		c0,19.509,2.731,38.819,8.117,57.393c3.94,13.586,14.402,24.164,27.988,28.295c4.042,1.229,8.17,1.831,12.264,1.831
		c9.679,0,19.157-3.367,26.782-9.764c26.931-22.595,61.155-35.038,96.366-35.038s69.435,12.443,96.365,35.038
		c10.851,9.104,25.448,12.069,39.046,7.934c13.586-4.132,24.048-14.709,27.988-28.295c5.386-18.573,8.117-37.883,8.117-57.393
		C468.493,264.68,449.018,215.006,413.655,176.853z M62.306,280.097c-5.739,4.811-13.167,6.312-20.378,4.117
		c-7.197-2.189-12.518-7.559-14.598-14.729C22.466,252.708,20,235.27,20,217.657c0-46.981,17.582-91.825,49.505-126.269
		c7.915-8.536,20.861-9.489,30.114-2.217c17.957,14.115,44.165,22.21,71.904,22.21c27.732,0,53.937-8.095,71.89-22.207
		c9.265-7.274,22.208-6.321,30.118,2.214c25.198,27.172,41.391,60.45,47.16,96.697c-6.77,1.379-13.891,2.167-21.197,2.315
		c0.952-1.937,1.498-4.11,1.49-6.416c-0.02-7.986-6.521-14.449-14.517-14.42c-7.986,0.019-14.439,6.52-14.419,14.516
		c0.005,1.344,0.207,2.639,0.554,3.873c-13.69-2.876-25.901-8.161-35.168-15.44c-17.522-13.765-42.085-11.899-57.137,4.34
		c-18.159,19.591-32.116,42.226-41.41,66.654C110.767,248.981,84.397,261.56,62.306,280.097z M441.167,368.549
		c-2.08,7.173-7.4,12.542-14.599,14.731c-7.209,2.193-14.636,0.692-20.371-4.121c-30.527-25.611-69.316-39.716-109.221-39.716
		s-78.693,14.105-109.22,39.716c-5.735,4.812-13.158,6.313-20.373,4.121c-7.197-2.189-12.519-7.558-14.598-14.731
		c-4.861-16.763-7.326-34.199-7.326-51.823c0-46.989,17.582-91.835,49.506-126.277c4.349-4.692,10.22-7.09,16.164-7.09
		c4.866,0,9.782,1.608,13.949,4.882c17.962,14.11,44.168,22.203,71.897,22.203s53.936-8.093,71.897-22.203
		c9.258-7.273,22.203-6.326,30.113,2.208c31.924,34.443,49.506,79.289,49.506,126.277
		C448.493,334.351,446.028,351.786,441.167,368.549z"
                  />
                  <path
                    d="M263.776,260.896h-17.437V243.46c0-3.615-2.287-6.835-5.7-8.026c-5.318-1.855-10.903-2.796-16.6-2.796
		c-5.696,0-11.281,0.941-16.6,2.796c-3.414,1.191-5.701,4.411-5.701,8.026v17.437h-17.436c-3.615,0-6.834,2.287-8.025,5.7
		c-1.856,5.318-2.797,10.904-2.797,16.601s0.941,11.283,2.797,16.601c1.191,3.413,4.41,5.7,8.025,5.7h17.436v17.436
		c0,3.615,2.287,6.834,5.7,8.025c5.319,1.856,10.905,2.797,16.601,2.797c5.697,0,11.283-0.941,16.601-2.797
		c3.413-1.191,5.699-4.411,5.699-8.025v-17.436h17.437c3.614,0,6.834-2.286,8.025-5.699c1.855-5.317,2.797-10.903,2.797-16.602
		s-0.941-11.285-2.797-16.602C270.61,263.182,267.39,260.896,263.776,260.896z M257.183,288.498h-19.344c-4.694,0-8.5,3.806-8.5,8.5
		v19.343c-3.481,0.553-7.12,0.552-10.601,0v-19.343c0-4.694-3.806-8.5-8.5-8.5h-19.343c-0.276-1.741-0.415-3.511-0.415-5.301
		s0.139-3.56,0.415-5.301h19.343c4.694,0,8.5-3.806,8.5-8.5v-19.343c3.482-0.553,7.12-0.552,10.601,0v19.344
		c0,4.694,3.806,8.5,8.5,8.5h19.344c0.276,1.741,0.415,3.511,0.415,5.301S257.459,286.757,257.183,288.498z"
                  />
                  <path
                    d="M411.973,297.569c0.01,0,0.029,0,0.039,0c7.996-0.029,14.449-6.521,14.43-14.517c-0.029-7.986-6.52-14.449-14.516-14.42
		c-7.987,0.019-14.449,6.52-14.42,14.507C397.524,291.116,403.996,297.569,411.973,297.569z"
                  />
                  <path
                    d="M347.715,268.758c-7.987,0.01-14.459,6.491-14.448,14.487c0.01,7.986,6.491,14.459,14.487,14.449
		c7.987-0.01,14.459-6.491,14.449-14.478C362.192,275.221,355.711,268.749,347.715,268.758z"
                  />
                  <path
                    d="M379.931,300.849c-0.087,0-0.164,0-0.251,0c-7.909,0.096-14.295,6.53-14.295,14.468c0,7.986,6.481,14.468,14.468,14.468
		c0.019,0,0.039,0,0.048,0c0.029,0,0.058,0,0.087,0c0.02,0,0.039,0,0.058,0c7.986-0.029,14.439-6.54,14.41-14.526
		C394.418,307.263,387.917,300.81,379.931,300.849z"
                  />
                  <path
                    d="M379.786,265.546c0.009,0,0.02,0,0.029,0c7.996-0.019,14.459-6.51,14.439-14.497c-0.019-7.996-6.511-14.459-14.497-14.439
		c-7.995,0.019-14.458,6.511-14.439,14.497C365.327,259.084,371.81,265.546,379.786,265.546z"
                  />
                </g>
              </svg>
            </label>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{scale:3}}
          transition={{ duration: 1 }}
          >
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
              animate={winningCells.includes(index)? { scale: getScaleValue() } : { scale: 1 }}
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
