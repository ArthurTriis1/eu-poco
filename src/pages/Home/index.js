import React from 'react';
import './style.scss';
import logoEuPoco from '../../assets/logo.png';
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
                    {/* <div className="btOut">
                        <button onClick={() => {history.push('/help')}} className="btIn">AJUDA</button>
                    </div> */}
                </div>
                <div className="infosContainer">
                    <h1 className="infoTitle">Localize poços outorgados próximos a você!</h1>
                </div>
                <img src={logoEuPoco} alt="EuPoço" className="logoEupoco"/>
            </div>
        </div>
    )
}

export default Home