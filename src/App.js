import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {VolumeSlider} from './components/VolumeSlider'
import 'react-rangeslider/lib/index.css' 
import 'bootstrap/dist/css/bootstrap.min.css'
import {GridCreator} from './components/GridCreator'

function App() {
  const [compName, setCompName] = useState('slider')
  const [allVol, setAllVol] = useState({})

  let sliderContent = [
    {id: 'row', content: 'Number of rows'},
    {id: 'column', content: 'Number of columns'},
    {id: 'obstruction', content: 'Number of obstructions'},
  ]
  const handleSubmit = (e, compName) => {
    e.preventDefault()
    console.log(compName, 'compName')
    console.log(allVol, 'allVol')
    setCompName(compName)
  }
  const handleVolumes = (id, vol) => {
    let _allVol = {...allVol}
    _allVol[id] = vol
    setAllVol(_allVol)
  }
  const handleBack = (compName) => {
    setCompName(compName)
  }
  return (
    <div>
      {compName === 'slider' &&
        <form onSubmit={(e) => handleSubmit(e, 'gridCreator')}>
          <div className="container">
            <h1>Waterflow Simulator</h1>
            <h3>Grid Creation</h3>

            {sliderContent && sliderContent.length > 0 &&
              sliderContent.map((slider) => {
                return (
                  <VolumeSlider id={slider.id} content={slider.content} 
                  handleVolumes={(id, vol) => handleVolumes(id, vol)} />
                )
              })}
            <input type='submit' className='btn btn-primary' />
          </div>
        </form>
      }
      {compName === 'gridCreator' &&
        <GridCreator allVol={allVol} handleBack={(compName) => handleBack(compName)}/>
      }
    </div>
  );
}

export default App;
