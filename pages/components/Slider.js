import React from "react";


function Slider(props) {




    return (

        <React.Fragment>
            <label className="switch">
            {props.showTabbedViewPage ?
                    <input type="checkbox" onClick={props.handleSliderToggle} checked />
                    :
                    <input type="checkbox" onClick={props.handleSliderToggle} />
                }
                <span className="slider round"></span>
            </label><span className="sliderText">{props.sliderText}</span>
        </React.Fragment>
    )

}

export default Slider;
