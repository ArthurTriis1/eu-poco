import React from 'react';
import './style.scss';
import logoPreserv from '../../assets/logo.png';
import { useHistory } from 'react-router-dom';


const Home = () => {

    const history = useHistory();


    return (
        <div className="containerHome">
            <div className="home">
                <div className="buttons">
                    <div className="btOut ">
                        <button onClick={() => {history.push('/map')}} className="btIn btHome">ENTRAR</button>
                    </div>
                    <div className="btOut">
                        <button onClick={() => {history.push('/about')}} className="btIn">SOBRE</button>
                    </div>
                    <div className="btOut">
                        <button onClick={() => {history.push('/help')}} className="btIn">AJUDA</button>
                    </div>
                </div>
                <div className="infosContainer">
                    <h1 className="infoTitle">Localize poços outogados próximos a você!</h1>
                </div>
                <img src={logoPreserv} alt="Preserv" className="logoPreserv"/>
            </div>
        </div>
    )
}

export default Home