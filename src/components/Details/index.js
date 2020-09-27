import React from 'react';

import './Details.css';

function Details({ details }) {
    return (
        <div className="wrapDetail">
            {
                details.map((detail, index) => (
                    <>
                        <h4 key={`h4-${index}`}>{detail.label}</h4>
                        <p key={`p-${index}`}>{detail.value}</p>
                    </>
                ))
            }
        </div>
    )
}

export default Details;