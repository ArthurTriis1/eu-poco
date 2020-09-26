import React from 'react';
import './ColabSpan.scss';
import {  FiExternalLink} from 'react-icons/fi';

function ColabSpan({ image, title, type, href }) {
  return (
      <div className={`colabSpanWrap ${href && "clicked"}`} onClick={() =>{
            if(href){
              window.location.href = href
            } 
         }}>
          <div className="imageColab" style={{backgroundImage: `url(${image})`}}></div>
          {
              title &&
              <h3>{title}
                  {
                      href &&
                      <FiExternalLink/>
                  }
              </h3>
          }


          {
              type &&
              <h4>{type}</h4>

          }

      </div>
  )
}

export default ColabSpan;