import React, { useEffect, useState, useRef } from 'react';
import { GeoJSON, Circle, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';

import apiSigabemMaps from '../../services/apiSigabemMaps';

import MapContainer from '../../components/MapContainer';
import Filters from '../../components/Filters'


import markerOrange from '../../assets/marker-orange.png';
import markerViolet from '../../assets/marker-violet.png';
import markerGreen from '../../assets/marker-green.png';
import markerBlue from '../../assets/marker-blue.png';
import markerRed from '../../assets/marker-red.png';
import busIcon from '../../assets/bus-stop.png';

import './MapPage.css';

import { 
    bairrosStyle, 
    bairrosStyleHover, 
    municipiosStyle, 
    municipiosStyleHover 
} from './StyleMap'


function MapPage() {
    const [ labelsLayers, setLabelsLayers] = useState([]);
    const [ bairros, setBairros ] = useState([]);
    const [ municipios, setMunicipios ] = useState([]);
    const [ selectedLayers, setSelectedLayers ] = useState([]);
    const [ showMunicipios, setShowMunicipios ] = useState(true);
    const [ showBairros, setShowBairros ] = useState(true);
    const [ showStops, setShowStops ] = useState(false);
    const [ showPcds, setShowPcds ] = useState(true);
    const [ loading, setLoading ] = useState(true);
    const [ details, setDetails ] = useState([]);
    const [ listBairros, setListBairros ] = useState([]);
    const [ listSex, setListSex ] = useState([])
    const [ listDeficiencia, setListDeficiencia ] = useState([])
    const [ viewport, setViewport ] = useState({
        center: [-8.063169, -34.871139],
        zoom: 16,
    })
    const [ searchCircle, setSearchCircle ] = useState({
        center: [-8.063169, -34.871139],
        radius: 350,
    })
    const [ stops, setStops ] = useState([]);
    const searchRadius = 350;
    const [ pcds, setPcds ] = useState([]);
    let mapRef = useRef(null);
    const deficientsIcons = {
        AUDITIVA: markerViolet,
        INTELECTUAL: markerBlue,
        VISUAL: markerRed,
        FISICA: markerGreen,
        MULTIPLA: markerOrange,
    }
    //Fim dos estados ----------------------------------------------------------

    useEffect(()=>{
        (async () => {
            try{
                const { data: bairrosReturn } = await apiSigabemMaps.get('/bairros');
                const { data: municipiosReturn } = await apiSigabemMaps.get('/municipios');
            
            setListBairros(
                bairrosReturn
                    .map(bairro => bairro.bairro)
                    .sort()
            );

            setSelectedLayers(old => [...old, {label: "Bairros", value: "bairros"}])
            
            setMunicipios(municipiosReturn.map((municipio, index) => {
                return {
                type: "Feature",
                id: index,
                properties: {
                    type: "municipio",
                    name: municipio.nome,
                    pop: municipio.populacao,
                    dens: municipio.dens_demo,
                    hover: false
                },
                geometry: JSON.parse(municipio.geometry),
                };
            }));
            setBairros(bairrosReturn.map((bairro, index) => {
                return {
                    type: "Feature",
                    id: index,
                    properties: {
                    type: "bairro",
                    name: bairro.bairro,
                    hover: false
                    },
                    geometry: JSON.parse(bairro.geometry),
                };
            }));
            setLabelsLayers([
                {label: "Municípios", value: "municipios"}, 
                {label: "Bairros", value: "bairros"},
                {label: "PCDs", value: "pcds"},
                {label: "Paradas", value: "paradas"},
            ])
            setListSex([
                {label: "Homem", value: "M"}, 
                {label: "Mulher", value: "F"},
            ])
            setListDeficiencia([
                {label: "Física", value: "FISICA", color: "green"}, 
                {label: "Intelectual", value: "INTELECTUAL", color: "blue"},
                {label: "Visual", value: "VISUAL", color: "red"}, 
                {label: "Múltipla", value: "MULTIPLA", color: "orange"},
                {label: "Auditiva", value: "AUDITIVA", color: "violet"}, 
            ]);

            setLoading(false);
            
            }catch(e){
                console.log(e)
            }
        })();
    },[])

    useEffect(()=>{
        if(selectedLayers?.length){
            setShowMunicipios(selectedLayers.map(layer => layer.value).includes("municipios"))
            setShowBairros(selectedLayers.map(layer => layer.value).includes("bairros"))
            setShowStops(selectedLayers.map(layer => layer.value).includes("paradas"))
            setShowPcds(selectedLayers.map(layer => layer.value).includes("pcds"))
        }else{
            setShowMunicipios(false)
            setShowBairros(false)
            setShowStops(false)
            setShowPcds(false)
        }
    }, [selectedLayers])

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

    const handleDoubleClickMap = async (e) => {
        const local = {
            center: e.latlng,
            radius: 350,
            zoom: 16,
        };
        setSearchCircle(local);
        setViewport(local);
        setStops([]);
        const { data: stopsReturn } = await apiSigabemMaps.get(
            `/stops?lat=${e.latlng.lat}&lon=${e.latlng.lng}&meters=${searchRadius}`
        );
        setStops(stopsReturn);
        if(!selectedLayers.map(l => l.value).includes("paradas")){
            setSelectedLayers(old => [...old, {label: "Paradas", value: "paradas"}])
        }
    }

    const handleFilter = async (filtering) => {
        const { data: pcdsReturn} = await apiSigabemMaps.post("/pcd", filtering, {})
        setPcds(pcdsReturn.map(pcd => {
            return {
                ...pcd,
                geometry: [
                    JSON.parse(pcd.geometry).coordinates[1],
                    JSON.parse(pcd.geometry).coordinates[0],
                ]
            } 
        }));


        const bounds = L.featureGroup(pcdsReturn.map(pcd => L.marker([
            JSON.parse(pcd.geometry).coordinates[1],
            JSON.parse(pcd.geometry).coordinates[0],
        ]))).getBounds();

        mapRef.current.leafletElement.fitBounds(bounds);
        if(!selectedLayers.map(l => l.value).includes("pcds")){
            setSelectedLayers(old => [...old, {label: "PCDs", value: "pcds"}])
        }
    }

    const pcdsIcon = (deficit) => {
        return L.icon({
            iconUrl: deficientsIcons[deficit],
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        })
    }

    return (
        <div className="mapPageContainer">
            <Filters 
                filter={e=> handleFilter(e)}
                initialLabelSex={listSex} 
                initialLabelBairros={listBairros}
                initialLabelDeficiencias={listDeficiencia}
                loading={loading}
            ></Filters>
            <MapContainer
                value={selectedLayers}
                fowardRef={mapRef}
                setUserPosition={e => setViewport(e)}
                viewport={viewport}
                doubleClickZoom={false}
                ondblclick={(e) => handleDoubleClickMap(e)}
                details={details}
                loading={loading}
                labels={labelsLayers}
                changeLayer={e => setSelectedLayers(e)}
            >


                {   
                    (municipios.length && showMunicipios) &&
                    municipios.map(municipio => (
                        <GeoJSON
                            onmouseover={(e) => {
                                setDetails([
                                    {
                                        label: "Município", 
                                        value: e.layer.defaultOptions.data.properties.name
                                    },
                                    {
                                        label: "População", 
                                        value: e.layer.defaultOptions.data.properties.pop
                                    }
                                ])
                            }}
                            onmouseout={() => setDetails([])}
                            key={municipio.id}
                            data={municipio}
                            style={municipiosStyle}
                            onEachFeature={hoverChangeStyle}
                        /> 
                    ))
                }
                {   
                    (bairros.length && showBairros) &&
                    bairros.map((bairro, index) => (
                        <GeoJSON
                            onmouseover={(e) => {
                                setDetails([{
                                    label: "Bairro", 
                                    value: e.layer.defaultOptions.data.properties.name}])
                            }}
                            onmouseout={() => setDetails([])}
                            onEachFeature={(feature, layer) => {
                                layer.on({
                                    'mouseover': (e) => {
                                        var layer = e.target;
                                        layer.setStyle(bairrosStyleHover);
                                    },
                                    'mouseout': (e) => {
                                        var layer = e.target;
                                        layer.setStyle(bairrosStyle);
                                    },
                                })
                            }}
                            key={bairro.id}
                            data={bairro}
                            style={bairrosStyle}
                        /> 
                    ))
                }
                {
                    showStops &&
                    <>
                        <Circle
                            center={searchCircle.center}
                            radius={searchCircle.radius}
                        />
                        {
                            stops.map(stop => (
                                <Marker
                                    key={stop.text}
                                    position={[stop.loc.lat, stop.loc.lon]}
                                    icon={L.icon({
                                        iconUrl: busIcon,
                                        iconSize: [50, 50], // size of the icon
                                        iconAnchor: [0, 30], // point of the icon which will correspond to marker's location
                                        popupAnchor: [15, -20],
                                    })}
                                />

                            ))
                        }
                    </>
                }

                {
                    showPcds &&
                    pcds.map((pcd, index) => (
                        <Marker
                            key={index}
                            position={pcd.geometry}
                            icon={pcdsIcon(pcd.deficiencia)}
                        >

                            <Popup>
                                    <h5>{pcd.nome}</h5>
                                    <strong>CPF:</strong> {pcd.cpf}
                                    <br></br>
                                    <strong>Deficiencia:</strong> 
                                      {pcd.deficiencia}
                                    <br></br>
                                    <strong>Local:</strong>
                                        {pcd.place}
                                    <br></br>
                                    <strong>Sexo:</strong> 
                                    { pcd.sexo === "M" ? "Masculino" : "Feminino"} 
                                    <br></br>
                                    <strong>Idade:</strong> 
                                    { pcd.idade }
                                    <br></br>
                            </Popup>

                        </Marker>
                    ))
                }

            </MapContainer>
            
        </div>
    )
}

export default MapPage;