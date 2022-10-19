import React from 'react';


import EnhancedReactBootstrapTable from './components/EnhancedReactBootstrapTable/EnhancedReactBootstrapTable';
import ErrorBoundary from './components/foundational/ErrorBoundary';

let defaultSortedDef = [{
      "dataField": "STRIKESTARTDTG",
      "order": "desc"
  }];
;

function HomePage(props){
        // console.log("data:", props.data);
       //  console.log("appConfig:", props.appConfig);
         return (
             
                            <ErrorBoundary appConfig={props.appConfig}>


                            <EnhancedReactBootstrapTable tableData={props.tableData} deleteItem={props.deleteItem} columnDef={props.columnDef} typeDisplaying='strike' canEditType={props.canEditType} 
                            mgrsField={props.mgrsField}  placeNameField={props.placeNameField} isAdmin={props.isAdmin} isOpsAdmin={props.isOpsAdmin} appConfig={props.appConfig} renderLocationInfo={props.renderLocationInfo}
                            defaultSortedDef={defaultSortedDef} shouldEdit={false}  showSearch={true} isExport={true} keyField={props.keyField} createUrl={props.appConfig.APP_CREATE_ITEM_URL} 
                            viewUrl={props.appConfig.APP_VIEW_ITEM_URL} editUrl={props.appConfig.APP_EDIT_ITEM_URL} geoLatField={props.geoLatField} geoLonField={props.geoLonField} 
                            handleViewRequest={props.handleViewRequest} handleEditRequest={props.handleEditRequest} deleteOnlyOpsAdmin={true} />
                            
                            </ErrorBoundary>
                    
 
         );

}

export default HomePage;
