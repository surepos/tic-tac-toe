import React from 'react';
import cross from "../images/cross.png"
import o from '../images/o.png';

function GameOver(props) {
  return (
    <div className='gameOver'>
    <div className="gameOverBody">
      <div className='winnerImage'>
        {props.winner === "X" && (
          <img src={cross} alt="Cross" />
        )}
        {props.winner === "O" && (
          <img src={o} alt="Circle" />
        )}
        {props.winner === "D" && (
          <>
            <img src={cross} alt="Cross" />
            <img src={o} alt="Circle" />
          </>
        )}
      </div>
      <div className="winner">{props.winner === "D" ? "Draw!" : "Winner!"}</div>
      <div className={`resetButton ${props.winner === "X"? "xGameReset" : ""}`} onClick={()=>{props.setGameReset(true)}}>Reset</div>
    </div>
  </div>
  
  )
}

export default GameOver