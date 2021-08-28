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
        for (let ele = 0; ele < allVol.column; ele++) {
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
        let _waterLocPoint = waterLocPoint
        let obsRow = null
        let obsCol = null
        for (let row = 0; row < allVol.row; row++) {
            let cellID = `cell0-${_waterLocPoint}`
            if (dropObsCount.includes(cellID)) {
                break;
            } else {
                let cellID = `cell${row}-${_waterLocPoint}`
                let element = document.getElementById(cellID)
                if (dropObsCount.includes(cellID)) {
                    if (element != null) {
                        element.style.backgroundColor = 'darkslategray'
                    }
                    obsRow = row
                    obsCol = _waterLocPoint
                    break;
                } else {
                    if (element != null) {
                        element.style.backgroundColor = 'blue'
                    }
                }
            }
        }
        if (obsRow != null) {
            leftObsFlow(obsRow, obsCol)
            rightObsFlow(obsRow, obsCol)
        }
    }

    const leftObsFlow = (obsRow, obsCol) => {
        let _obsRow = obsRow
        for (let col = obsCol - 1; col >= 0; col--) {
            for (let row = _obsRow-1; row < allVol.row; row++) {
                let cellID = `cell${row}-${col}`
                let element = document.getElementById(cellID)
                if (dropObsCount.includes(cellID)) {
                    if (element != null) {
                        element.style.backgroundColor = 'darkslategray'
                    }
                    if (row == _obsRow-1) {
                        _obsRow = null
                    } else {
                        _obsRow = row
                    }
                    break;
                } else {
                    if (element != null) {
                        element.style.backgroundColor = 'blue'
                    }
                    _obsRow = row
                }
            }
            if (_obsRow == allVol.row - 1 || _obsRow == null) {
                break;
            }
        }
    }
    const rightObsFlow = (obsRow, obsCol) => {
        let _obsRow = obsRow
        for (let col = obsCol + 1; col < allVol.column; col++) {
            for (let row = _obsRow-1; row < allVol.row; row++) {
                let cellID = `cell${row}-${col}`
                let element = document.getElementById(cellID)
                if (dropObsCount.includes(cellID)) {
                    if (element != null) {
                        element.style.backgroundColor = 'darkslategray'
                    }
                    if (row == _obsRow-1) {
                        _obsRow = null
                    } else {
                        _obsRow = row
                    }
                    break;
                } else {
                    if (element != null) {
                        element.style.backgroundColor = 'blue'
                    }
                    _obsRow = row
                }
            }
            if (_obsRow == allVol.row - 1 || _obsRow == null) {
                break;
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
                <div className='gridObsSec'>
                    <div>{obstruction}</div>
                </div>
            </div>

            <button type='submit' value='Back' style={{ margin: '2%' }} className='btn btn-primary' onClick={() => { props.handleBack('slider') }} >Back</button>
            {waterLocPoint == null && <button type='submit' value='Start Simulation' onClick={() => handleSimulation()} disabled={!showSimulation} className='btn btn-primary'>Start Simulation</button>}
            {waterLocPoint != null && <button type='submit' value='Start' onClick={() => handleWaterFlow()} className='btn btn-primary'>Start</button>}
        </div>
    )
}