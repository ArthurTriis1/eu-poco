import React from 'react';
import { MdGpsFixed } from 'react-icons/md';
import './style.scss'

const GeolocationButton = props => {

    const {geoClick} = props;

    return (
        <div className={"TargetIconOut"} onClick={geoClick}>
            <div className={"TargetIconIn"}>
                <MdGpsFixed className={"TargetIcon"}/>
            </div>
        </div>
    )
}

export default GeolocationButton;