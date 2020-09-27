import React from 'react';

import './Details.scss';

function Details({ details }) {
    return (
        <div className="wrapDetail">
            {
                details.map((detail, index) => (
                    <>
                        <p key={`p-${index}`}>{detail.value}</p>
                    </>
                ))
            }
        </div>
    )
}

export default Details;