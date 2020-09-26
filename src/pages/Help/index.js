import React from 'react'
import { FiArrowLeft } from "react-icons/fi";
import logo from '../../assets/logo.png';
import './style.scss'
import { useHistory } from 'react-router-dom';
import  Info  from '../../components/Info';


const Help = () => {

    const history = useHistory();

    return (
        <div className="containerAbout">
            <header className="headerAbout headerHelp">
                <button className="returnButtonOut returnButtonAbout"  onClick={() => history.goBack()}>
                    <FiArrowLeft className="returnButtonIn"/>
                </button>
                <img src={logo} alt="Preserv" className="logoHeaderAbout"/>
            </header>

            <div className="infoContatinerHelp">
                <h2>Xx   XXXXXX XXXXXXXXXXX?</h2>
                <Info information="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."/>


            </div>
        </div>
    )
}

export default Help;