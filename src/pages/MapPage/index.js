import React, { useState, useEffect, useRef } from 'react';
import { Map, TileLayer, Marker, GeoJSON} from 'react-leaflet'
import pointer from '../../assets/pointer.png';
import shadow from '../../assets/shadow.png'
import apiGov from '../../services/apiGov';
import SelectLayer from '../../components/SelectLayer';
import SelectBairros from '../../components/SelectBairros';
import GeolocationButton from '../../components/GeolocationButton';
import outorgasJSON from '../../shapes/outorgas.json'
import municipiosJSON from '../../shapes/pe.json'
import { useHistory } from 'react-router-dom';
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";

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

    const [ municipios, setMunicipios ] = useState([]);
    const [ details, setDetails ] = useState([]);
    const [layerOutorgas, setLayerOutorgas] = useState([]);
    const [outorgas, setOutorgas] = useState(false)
    //#endregion

    const municipiosStyle = {
        color: '#fff',
        weight: 3,
        fillOpacity: 0.5,
        fillColor: 'green',
    }

    const municipiosStyleHover = {
        color: '#fff',
        weight: 3,
        fillOpacity: 0.8,
        fillColor: 'green',
    }

    useEffect(()=>{

        apiGov.get('bairros')
            .then((resp) => {
                const results = resp.data.result.records.map((r) => {return r['bairro']});
                setBairros(results);
                
            })

        setLayerOutorgas(outorgasJSON);

        setMunicipios(municipiosJSON)
    },[]);

    useEffect(() => {
        let eupocoState = sessionStorage.getItem("eupocoState");
        eupocoState = JSON.parse(eupocoState)

        if(eupocoState){
            setOutorgas(eupocoState.tratamento)
            setViewport(eupocoState.viewport)
        }else  {
            getPosition()
        }
    }, [])


    function getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos =>{
                setViewport({
                    center: [ pos.coords.latitude, pos.coords.longitude ],
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
            tratamento: outorgas || false
        };
        sessionStorage.setItem("eupocoState", JSON.stringify(state))
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

    const plotMapOutorga = (layer) =>{
        return (

            layer
                .filter(marker =>  !!(Number(marker.latitude) && Number(marker.longitude)))
                .map(marker => (
            <Marker
                position={[Number(marker.latitude), Number(marker.longitude)]}
                key={String(marker.process)}
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

    const hoverChangeStyle = (feature, layer) => {
        layer.on({
            'mouseover': (e) => {
                var layer = e.target;
                layer.setStyle(municipiosStyleHover);
            },
            'mouseout': (e) => {
                var layer = e.target;
                layer.setStyle(municipiosStyle);
            },
        })
    }

    return (
        <>
            <HeaderDetails />

            <div className="containerMap" >
                <section className="containerOptions" >
                    {/*<SelectLayer name="Preservativos"          call={(data) => {setPreserv(data.show); saveMapState()}}   initialShow={!preserv} />*/}
                    {/*<SelectLayer name="Teste de DST"            call={(data) => {setTeste(data.show); saveMapState()}} initialShow={!teste}/>*/}
                    {/*<SelectLayer name="Prevenção de urgência"   call={(data) => {setPrevencao(data.show); saveMapState()}}  initialShow={!prevencao}/>*/}
                    <SelectLayer name="Localização das Outorgas"       call={(data) => {setOutorgas(data.show); saveMapState()}} initialShow={!outorgas}/>
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

                    {/* Layer de Tratamento */}
                    {outorgas &&
                        <MarkerClusterGroup>
                            {plotMapOutorga(layerOutorgas)}
                        </MarkerClusterGroup>
                    }
                    {
                        municipios.map(municipio => (
                            <GeoJSON
                                key={municipio.id}
                                data={municipio}
                                // onmouseover={(e) => {
                                //     setDetails([
                                //         {
                                //             label: "Município",
                                //             value: e.layer.defaultOptions.data.properties.name
                                //         },
                                //         {
                                //             label: "População",
                                //             value: e.layer.defaultOptions.data.properties.pop
                                //         }
                                //     ])
                                // }}
                                // onmouseout={() => setDetails([])}
                                // style={municipiosStyle}
                                // onEachFeature={hoverChangeStyle}
                            />
                        ))
                    }
                </Map>
               
            </div>
        </>
    )
}

export default MapPage;                                                                                                                                                                                            