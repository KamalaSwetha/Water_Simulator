import React, { useState } from 'react'
import './slider.css'

export function GridCreator(props) {
    const [showSimulation, setShowSimulation] = useState(false)
    const [dropObsCount, setDropObsCount] = useState([])
    const [startSimulation, setStartSimulation] = useState(false)
    const [waterLocPoint, setWaterLocPoint] = useState(null)

    let { allVol } = { ...props }
    let rows = [];
    for (var i = 0; i < allVol.row; i++) {
        let rowID = `row${i}`
        let cell = []
        for (var idx = 0; idx < allVol.column; idx++) {
            let cellID = `cell${i}-${idx}`
            cell.push(<td key={cellID} id={cellID} onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDrop(e, cellID)}></td>)
        }
        rows.push(<tr key={i} id={rowID}>{cell}</tr>)
    }
    let obstruction = []
    let obsWidth = Math.round(50 / (allVol.row))
    obsWidth = obsWidth + '%'
    for (let i = 0; i < allVol.obstruction; i++) {
        let obstructionId = `obstruction${i}`
        obstruction.push(<div className='obstruction'
            style={{ width: obsWidth }}
            key={obstructionId}
            id={obstructionId}
            draggable
            onDragStart={(e) => onDragStart(e, obstructionId)}
            onDragOver={(e) => onDragOver(e)}
        // onDrop={(e)=>onDrop(e)}
        ></div>)
    }
    let waterCells = []
    for (let idx = 0; idx < allVol.column; idx++) {
        let waterCellId = `watercell${idx}`
        waterCells.push(<div className='obstruction'
        style={{ width: obsWidth, margin: '0%', backgroundColor: 'lightblue' }}
        key={waterCellId}
        id={waterCellId}
        onClick={() => handleWaterLocPoint(idx)}
    ></div>)
    }
    const onDragOver = (e) => {
        e.preventDefault()
    }
    const onDrop = (e, cellID) => {
        let _dropObsCount = dropObsCount
        _dropObsCount.push(cellID)
        e.preventDefault();
        document.getElementById(cellID).style.backgroundColor = 'darkslategray'
        setDropObsCount(_dropObsCount)
        if (_dropObsCount.length >= 1) {
            setShowSimulation(true)
        }
    }
    const onDragStart = (e, id) => {
        document.getElementById(id).style.backgroundColor = 'lightgrey'
    }
    const handleSimulation = () => {
        setStartSimulation(true)
    }
    const handleWaterLocPoint = (id) => {
        for (let ele = 0; ele < allVol.column ; ele++) {
            let waterCellId = `watercell${ele}`
            if (ele == id) {
                setWaterLocPoint(id)
                document.getElementById(waterCellId).style.backgroundColor = 'blue'
            } else {
                document.getElementById(waterCellId).style.visibility = 'hidden'
            }
        }
    }
    const handleWaterFlow = () => {
        console.log('dropObsCount', dropObsCount)
        console.log('dropObsCount', waterLocPoint)
        waterFlowLoop()
    }
    const waterFlowLoop = () => {
        // let _waterLocPoint = []
            let _waterLocPoint = waterLocPoint
            let cellID = `cell0-${waterLocPoint}`
            document.getElementById(cellID).style.backgroundColor = 'blue'
        for (let row = 1; row < allVol.row; row++) {
            for (let col = _waterLocPoint - 1; col <= _waterLocPoint + 1; col++) {
                let cellID = `cell${row}-${col}`
                if (dropObsCount.includes(cellID)) {
                    if ( document.getElementById(cellID) != 'undefined' || document.getElementById(cellID) != null) {
                        document.getElementById(cellID).style.backgroundColor = 'darkslategray'
                    }
                    for (let i= row-1; i < allVol.row; i++) {
                        let column = col > _waterLocPoint ? col+1 : col-1
                        let cellID = `cell${i}-${column}`
                        if (dropObsCount.includes(cellID)) {
                            if ( document.getElementById(cellID) != 'undefined' || document.getElementById(cellID) != null) {
                                document.getElementById(cellID).style.backgroundColor = 'darkslategray'
                            }
                        } else {
                            document.getElementById(cellID).style.backgroundColor = 'blue'
                        }
                    }
                } else {
                    if ( document.getElementById(cellID) != 'undefined' || document.getElementById(cellID) != null) {
                        document.getElementById(cellID).style.backgroundColor = 'blue'
                    }
                }
            }

        }
    }
    return (
        <div className='container'>
            <div className='row'>
                <h1>Waterflow Simulator</h1>
                <h6>Drag the obstructions and place it inside the grid</h6>
            </div>
            <div className='gridObsContainer'>
            <div className='gridObsSec'>
                {startSimulation &&
                waterCells
                }
                <table id='students'>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
            <div  className='gridObsSec'>
            <div>{obstruction}</div>
            </div>
            </div>
            
            <button type='submit' value='Back' style={{ margin: '2%' }} className='btn btn-primary' onClick={()=>{props.handleBack('slider')}} >Back</button>
            {waterLocPoint == null && <button type='submit' value='Start Simulation' onClick={() => handleSimulation()} disabled={!showSimulation} className='btn btn-primary'>Start Simulation</button>}
            {waterLocPoint != null && <button type='submit' value='Start' onClick={() => handleWaterFlow()} className='btn btn-primary'>Start</button>}
        </div>
    )
}