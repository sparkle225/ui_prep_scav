import React from "react";

import { Collapse, Button, ButtonToolbar } from 'react-bootstrap';

import EnhancedReactBootstrapTable from './components/EnhancedReactBootstrapTable/EnhancedReactBootstrapTable';


function TableView(props) {
    return (
        <React.Fragment>
            <div id="data" className="row">
                <Button className="accordianBar"
                    onClick={() => {
                        console.log("in onclick onPanel TableView", props.panelStateMap.get(props.LAYER_LBL), "props.datalist", props.datalist);
                        props.handlePanelState(props.LAYER_LBL);
                    }}
                    aria-controls="example-collapse-text"
                    aria-expanded={props.panelStateMap.get(props.LAYER_LBL)}
                    disabled={props.disabledCrit!=undefined?pros.disabledCrit:false}
                >
                    {props.LAYER_LBL}
                </Button>
                <Collapse in={props.panelStateMap.get(props.LAYER_LBL)}>
                    <div>
                        {props.getErrorsForType(props.data.errorMap, props.LAYER_LBL.toLowerCase()).size > 0 ? (
                            props.getErrorsListFromMap(props.getErrorsForType(props.data.errorMap, props.LAYER_LBL.toLowerCase())).map(entry => {
                                console.log("entry", entry);
                                return <React.Fragment><div className="has-error">{entry}</div><br /></React.Fragment>
                            })) : null
                        }
                     

                        <div >

                            <div>
                                <EnhancedReactBootstrapTable tableData={props.data[props.appConfig.layerIdMap.get(props.LAYER_LBL).listName]} deleteItem={props.deleteItem} layerType={props.LAYER_LBL} editElemMap={new Map()} mustPopulate={props.mustPopulate}
                                    columnDef={props.appConfig.layerIdMap.get(props.LAYER_LBL).columns} typeDisplaying={props.LAYER_LBL} canEditType={props.canEditType(props.LAYER_LBL)} shouldEdit={false} submitData={props.submitData}
                                    showSearch={false} isExport={false} displayPDF={false} isOpsAdmin={props.isOpsAdmin} geoLatField={props.appConfig.layerIdMap.get(props.LAYER_LBL).geoLat} renderLocationInfo={props.renderLocationInfo}
                                    geoLonField={props.appConfig.layerIdMap.get(props.LAYER_LBL).geoLon} canShowAdd={true} uiFieldLoader={props.getUIFieldByDataFieldNameAndType} extraCss={props.appConfig.TABLE_EXTRA_CSS} id={props.LAYER_LBL+"Table"}

                                    {...props} />

                            </div>

                        </div>
                    </div>
                </Collapse>
            </div>
            <br /><br />
        </React.Fragment>
    )
}

export default TableView;
