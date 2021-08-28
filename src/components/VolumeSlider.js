import React, {useState} from 'react'
import Slider from 'react-rangeslider'
import './slider.css'
 

export function VolumeSlider (props) {
    const [volume, setVolume] = useState(0)

    const {id, content} = {...props}
    
    const handleOnChange = (value, id) => {
        setVolume(value)
        props.handleVolumes(id, value)
      }
    return (
        <div>
        <div className='container'>
            <h4>{content}</h4>
            <Slider
                min={0}
                max={10}
                step={1}
                value={volume}
                id={id}
                onChange={(value)=> handleOnChange(value, id)}
            />
            <span>{volume}</span>
        </div>
        </div>
    )
}