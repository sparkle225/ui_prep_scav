import React from 'react';

function Banner(props) {

        return (
            <div className="banner">
               {props.classification}
            </div>
        );
}
export default Banner;
