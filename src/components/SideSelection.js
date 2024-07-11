import React from 'react'
import cross from "../images/cross.png"
import o from '../images/o.png';

function SideSelection(props) {
  return (
    <div className="playerSide">
    <div className="playerSideBody">
      <div className="title"> Pick your side</div>
      <div className="playerOption">
        <div className="oPlayer" onClick={() => props.playerSideHandle('O')}>
          <img src={o} alt="O-Player" />
        </div>
        <div className="xPlayer" onClick={() => props.playerSideHandle('X')}>
          <img src={cross} alt="X-Player" />
        </div>
      </div>
    </div>
  </div>
  )
}

export default SideSelection