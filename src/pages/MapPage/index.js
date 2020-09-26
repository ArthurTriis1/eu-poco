import React, { useState, useEffect, useRef } from 'react';
import { Map, TileLayer, Marker} from 'react-leaflet'
import pointer from '../../assets/pointer.png';
import shadow from '../../assets/shadow.png'
import apiGov from '../../services/apiGov';
import SelectLayer from '../../components/SelectLayer';
import SelectBairros from '../../components/SelectBairros';
import GeolocationButton from '../../components/GeolocationButton';

import { useHistory } from 'react-router-dom';
import L from 'leaflet';

import './style.scss'
import HeaderDetails from '../../components/HeaderDetails';

const MapPage = () => {
    
    const history = useHistory();
    
    const mapEl = useRef(null)
    
    const pointerIcon = new L.Icon({
        iconUrl: pointer,
        shadowUrl: shadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
    
    const [viewport, setViewport] = useState({
        center: [-8.063169, -34.871139],
        zoom: 15,
      })
    //#region Estados
    const [bairros, setBairros] = useState([]);

    const [layerPreservativos, setLayerPreservativos] = useState([]);
    const [preserv, setPreserv] = useState(false)

    const [layerTeste, setLayerTeste] = useState([]);
    const [teste, setTeste] = useState(false)
    
    const [layerPrevencao, setLayerPrevencao] = useState([]);
    const [prevencao, setPrevencao] = useState(false)

    const [layerTratamento, setLayerTratamento] = useState([]);
    const [tratamento, setTratamento] = useState(false)
    //#endregion



    useEffect(()=>{
        apiGov.get('bairros')
            .then((resp) => {
                const results = resp.data.result.records.map((r) => {return r['bairro']});
                setBairros(results);
                
            })
        apiGov.get('preservativos')
            .then((resp) => {
                const results = resp.data.result.records;
                setLayerPreservativos(results);
            })
        apiGov.get('testes')
            .then((resp) => {
                const results = resp.data.result.records;
                setLayerTeste(results);
            })
        apiGov.get('prevencao')
            .then((resp) => {
                const results = resp.data.result.records;
                setLayerPrevencao(results);
            })
        apiGov.get('tratamento')
        .then((resp) => {
            const results = resp.data.result.records;
            setLayerTratamento(results);
        })
    },[]);

    useEffect(() => {
        let preservState = sessionStorage.getItem("preservState");
        preservState = JSON.parse(preservState)

        if(preservState){
            setTeste(preservState.teste);
            setTratamento(preservState.tratamento)
            setPreserv(preservState.preserv)
            setPrevencao(preservState.prevencao)
            setViewport(preservState.viewport)
        }else  {
            getPosition()
        }
    }, [])


    function getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos =>{
                setViewport({
                    center: [ pos.coords.latitude, pos.coords.longitude],
                    zoom: 18  
                });
            });
        }
    }

    const saveMapState = () =>{

        const state = {
            viewport: {
                center: mapEl.current.viewport.center,
                zoom: mapEl.current.viewport.zoom
            },
            teste: teste || false,
            preserv : preserv || false,
            prevencao: prevencao || false,
            tratamento: tratamento || false
        };
        sessionStorage.setItem("preservState", JSON.stringify(state))
    }


    const plotMap = (layer) =>{
        return (layer.map(marker => (
            <Marker
                position={[Number(marker.latitude), Number(marker.longitude)]}
                key={String(marker._id)}
                icon={pointerIcon}
                onClick={() => {
                    saveMapState();
                    history.push({ 
                        pathname: "/details", state: { marker } 
                    });
                }}
                >
            </Marker>)
        ))
    }

    return (
        <>
            <HeaderDetails />

            <div className="containerMap" >
                <section className="containerOptions" >
                    <SelectLayer name="Preservativos"          call={(data) => {setPreserv(data.show); saveMapState()}}   initialShow={!preserv} />
                    <SelectLayer name="Teste de DST"            call={(data) => {setTeste(data.show); saveMapState()}} initialShow={!teste}/>
                    <SelectLayer name="Prevenção de urgência"   call={(data) => {setPrevencao(data.show); saveMapState()}}  initialShow={!prevencao}/>
                    <SelectLayer name="Tratamento de DST"       call={(data) => {setTratamento(data.show); saveMapState()}} initialShow={!tratamento}/>      
                </section>

                 <div className={`inputsLocal`}>
                    <GeolocationButton geoClick={getPosition}/>
                    <SelectBairros 
                        bairros={bairros} 
                        callGo={(data) => setViewport({center: data, zoom: 16})}
                    />
                </div>

                <Map
                    ref={mapEl}
                    onViewportChanged={(e) => setViewport(e)}
                    viewport={viewport}
                    style={{ height: "100vh", width: "100%"}}
                    >
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Layer de Preservativos */}
                    {preserv && plotMap(layerPreservativos)}

                    {/* Layer de Testes */}
                    {teste && plotMap(layerTeste)}

                    {/* Layer de Prevencao */}
                    {prevencao && plotMap(layerPrevencao)}

                    {/* Layer de Tratamento */}
                    {tratamento && plotMap(layerTratamento)}
                </Map>
               
            </div>
        </>
    )
}

export default MapPage;