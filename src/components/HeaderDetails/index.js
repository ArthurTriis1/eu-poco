import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiX, FiArrowLeft } from "react-icons/fi";
import logo from '../../assets/logo.png';
import './style.scss'


const HeaderDetails = props => {

    const { isInformation } = props;

    const history = useHistory();

    return (
        <header className="headerMap">
            <button className="returnButtonOut"  onClick={() => history.goBack()}>
                {
                    isInformation ? 
                    <FiX className="returnButtonIn"/> :
                    <FiArrowLeft className="returnButtonIn"/>

                }
            </button>
            {
                isInformation &&
                <h1 className="logoHeaderTitle">INFORMAÇÕES</h1>
            }
            <img src={logo} alt="EuPoço" className="logoHeaderMap"/>
        </header>
    )
}

export default HeaderDetails;

