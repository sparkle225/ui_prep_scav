import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./SideBar.js";
import TableView from "./TableView.js";

const Dash = props => {
  return (

    <Container fluid>
      <Row>
        <Col xs={1} id="sidebar-wrapper">
          {props.strikeId!=undefined && props.strikeId!=null?
          <Sidebar sliderText={props.sliderText} showTabbedViewPage={props.showTabbedViewPage} handleSliderToggle={props.handleSliderToggle} data={props.data}/>:null}
        </Col>
        <Col xs={11} id="page-content-wrapper">
        
            <TableView {...props} />
       
        </Col>
      </Row>

    </Container>

  );
};
const Dashboard = Dash;
export default Dashboard
