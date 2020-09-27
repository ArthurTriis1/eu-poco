import React, { useState, useEffect, useRef } from 'react';
import { Map, TileLayer, Marker, GeoJSON} from 'react-leaflet'
import pointer from '../../assets/pointer.png';
import shadow from '../../assets/shadow.png'
import apiGov from '../../services/apiGov';
import SelectLayer from '../../components/SelectLayer';
import SelectBairros from '../../components/SelectBairros';
import GeolocationButton from '../../components/GeolocationButton';
import outorgasJSON from '../../shapes/outorgas.json'
import municipiosJSON from '../../shapes/municipios.json'
import { useHistory } from 'react-router-dom';
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";

import './style.scss'
import HeaderDetails from '../../components/HeaderDetails';
import Details from '../../components/Details'

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
    const [ showMunicipios, setShowMunicipios ] = useState(false);

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

        setMunicipios(municipiosJSON.map((municip, index) => {
            return {
            type: "Feature",
            id: index,
            properties: {
                type: "municipio",
                name: municip.nome,
                pop: municip.populacao,
                dens: municip.dens_demo,
                hover: false
            },
            geometry: municip.geometry,
            };
        }));
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


    const plotMapOutorga = (layer) =>{
        return (

            layer
                .filter(marker =>  !!(Number(marker.latitude) && Number(marker.longitude)))
                .map((marker, index) => (
            <Marker
                position={[Number(marker.latitude), Number(marker.longitude)]}
                key={index}
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
                {
                    Boolean(details.length) &&
                    <Details details={details}/>
                }
                <section className="containerOptions" >
                    <SelectLayer name="Municipios"                     call={(data) => {setShowMunicipios(data.show); saveMapState()}}  initialShow={!showMunicipios}/>
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
                        showMunicipios &&
                        municipios.map((municipio, index) => (
                            <GeoJSON
                                key={index}
                                data={municipio}
                                onmouseover={(e) => {
                                    setDetails([
                                        {
                                            label: "Município",
                                            value: e.layer.defaultOptions.data.properties.name
                                        },
                                    ])
                                }}
                                onmouseout={() => setDetails([])}
                                style={municipiosStyle}
                                onEachFeature={hoverChangeStyle}
                            />
                        ))
                    }
                </Map>
               
            </div>
        </>
    )
}

export default MapPage;                                                                                                                                                                                            
