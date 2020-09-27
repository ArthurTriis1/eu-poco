import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderDetails from '../../components/HeaderDetails'

import { FaMapMarkerAlt, FaWater, FaCodepen } from 'react-icons/fa';
import { RiFunctionLine } from 'react-icons/ri';
import { GrDocumentVerified } from 'react-icons/gr';
import { MdDateRange } from 'react-icons/md';

import './styles.scss'

export default function LocationDetails() {

    const location = useLocation();

    const {
        process,
        local,
        county,
        goal,
        situation,
        aquifer,
        hydrographic,
        date_perfuration,
        depth,
        pve_date,
        grant_date,
        flow,
        expiration_date,
    } = location.state.marker;
 
    const marker = {
        local: `Local: ${local} , ${county}`,
        process: `Processo: ${process}, Situação: ${situation}`,
        aquifer: `Aquifero: ${aquifer}, Bacia Hidrografica: ${hydrographic}`,
        dates: `Perfuração: ${date_perfuration}, 
        PVE: ${pve_date}, Outorga: ${grant_date}, 
        Validade: ${expiration_date}`,
        func: "Função: " + goal,
        caracteristicas: `Profundidade: ${depth} (M), Vazão: ${flow}(M³/DIA)`
    }
    

    const infos = [
        {icon: GrDocumentVerified , att: "process"},
        {icon: RiFunctionLine, att: "func"},
        {icon: FaMapMarkerAlt, att: "local"},
        {icon: MdDateRange, att: "dates"},
        {icon: FaWater, att: "aquifer"},
        {icon: FaCodepen, att: "caracteristicas"},
    ]

    return (
        <div className={"container"}> 
            <HeaderDetails isInformation={true}/>

            <div className={"informationsContainer"}>
                {
                    infos.map(info => {
                        if(String(marker[info.att]).length > 0){
                            return (
                                <div key={String(info.att)} className="groupInformation">
                                    <info.icon size={32} className="caracterLogo"/>
                                    <p className={"caracterText"}>{marker[info.att]}</p>
                                </div>
                            )
                        }
                        return null;
                    })
                }
            </div> 
        </div>
    );
}
