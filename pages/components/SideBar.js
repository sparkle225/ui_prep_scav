import React, { useRef, useEffect } from "react";
import { Nav } from "react-bootstrap";


const scrollTo1 = elementToScrollId => {
    // alert("should scroll to "+ elementToScrollId);
    //alert('offset position element'+ $(elementToScrollId).offset().top);
    let elem = $(elementToScrollId);
    $([document.documentElement, document.body]).animate({
        scrollTop: $(elementToScrollId).position().top
    }, 2000);
}


const scrollTo = elementToScrollId => {
    let itemToScrollTo = document.getElementById(elementToScrollId);
    if(itemToScrollTo!=null){
        itemToScrollTo.scrollIntoView();
    }
    
}

const Side = props => {


    return (

        <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
            activeKey="strikes" >
                <Slider sliderText={props.sliderText} handleSliderToggle={props.handleSliderToggle}/>
                <br/>
            <Nav.Item>
                <Nav.Link eventKey="strikes" onSelect={() => scrollTo('strikes')}>Strike</Nav.Link>
            </Nav.Item>
            <Nav.Item >
                <Nav.Link eventKey="assets" onSelect={() => scrollTo('assets')}>Assets</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="munitions" onSelect={() => scrollTo('munitions')}>Munitions</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="bda" onSelect={() => scrollTo('bda')}>BDA</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="civcas" onSelect={() => scrollTo('civcas')}>CIVCAS</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="attachments" onSelect={() => scrollTo('attachments')}>Attachments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="map" onSelect={() => scrollTo('map')}>Map</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="timeline" onSelect={() => scrollTo('timeline')}>Timeline</Nav.Link>
            </Nav.Item>
        </Nav>

    );
};
const Sidebar = Side;
export default Sidebar
