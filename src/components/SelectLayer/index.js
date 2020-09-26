import React, {useState, useEffect} from 'react';
import './style.scss';


const SelectLayer = props => {

    const {call, name, initialShow} = props;

    const [show, setShow] = useState(initialShow || true)

    useEffect(() => {
        setShow(initialShow)
    }, [initialShow])

    function invertShow(){
        setShow(!show)
        if(call){
            call({name, show})
        }
    }


    return (
        <button className={"OutLine " + (show ? "OutLineStatic": "OutLineClicked")} onClick={invertShow} >
            <div className={"btStyle " + (show? "btStyleStatic" : "btStyleClicked")}>
                <p className={"text " + ( show ? "textStatic" : "textClicked")}>{name}</p>
            </div>
        </button>
    );
}

export default SelectLayer;