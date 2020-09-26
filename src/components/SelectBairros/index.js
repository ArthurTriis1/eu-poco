import React, {useState} from 'react';

import apiGeolocation from '../../services/apiGeolocation'
import './style.scss';

export default function SelectBairro(props) {

    const { bairros, stateChange, callGo }  = props;


    const [getBairros, setBairros] = useState(bairros);

    const [clicked, setClicked] = useState(false);

    function click(){
        setClicked(!clicked);
        setBairros(bairros)
        if(stateChange){
            stateChange(!clicked);
        }
    }

    async function Go(bairroName){
        bairroName = bairroName  === "Alto Santa Terezinha " ? "Alto Santa Teresinha" : bairroName
        if(callGo){
            let data = await apiGeolocation.get(`${bairroName}+recife%20brasil&format=json&limit=1`);
            data = data.data[0]
            if (data){
                callGo([ Number(data.lat), Number(data.lon)])
            }else{
                callGo([ -8.063169, -34.871139])
            }
            click()
        }

    }

    

    return (
        <div className={"containerBairro"}>
                {   clicked &&
                    (<div className={"listBairros"}>
                            {
                                getBairros.map(item  => (
                                        <p  className={"bairroOptions"} key={item} onClick={() =>{Go(item)}}>{item}</p>
                                ))
                            }
                    </div>)
                    
                }   
                <button className={clicked ?  "OutLineClickedBairros" : "OutLineBairros"} onClick={click}>
                    <div className={`btStyleBairros ${clicked ?  "btStyleClickedBairros": "btStyleStaticBairros"}` }>
                        <p className={`textBairros ${clicked ? "textClickedBairros" : "textStaticBairros"}`}>Selecionar Bairro</p>
                    </div>
                </button>
        </div>
    );
}
