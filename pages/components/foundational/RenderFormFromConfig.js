

import React from "react";

import RenderFormComponent from './RenderFormComponent.js';
import WithRenderFormComponent from './WithRenderFormComponent.js';
const ViewWithRenderFormComponent = WithRenderFormComponent(RenderFormComponent);


export default class RenderFormFromConfig extends React.Component {
    constructor(props) {
        super(props);

        //this._isAdmin = this._isAdmin.bind(this);
        this._renderForm = this._renderForm.bind(this);
        this._mustPopulate=this._mustPopulate.bind(this);

    }

   
     
    _mustPopulate(uiFieldDefEntry, readOrEditMode) {
        //console.log("grpsCanEdit:", uiFieldDefEntry.grpsCanEdit);
      //  console.log("userInfo:", this.props.data.userInfo.userGroups);
        let mustPop;
        if (this.props.edit && uiFieldDefEntry.required && uiFieldDefEntry.grpsCanEdit && uiFieldDefEntry.grpsCanEdit.length > 0 && readOrEditMode === this.props.appConfig.MODE_EDIT) {
            mustPop= this.props.data.userInfo.userGroups.some(grpId => uiFieldDefEntry.grpsCanEdit.indexOf(grpId.groupID) !== -1);
        } else {
            mustPop= false;
        }
      //  console.log("in mustpopulae for:".concat(uiFieldDefEntry.id).concat(" :"),mustPop);
        return mustPop;
      
    } 

 

    /**
     * Loop through ordered uiDefFields based on "order" attribute to order the layerUIFieldsList before dynamic UI build. UiDefFields array will contain
     * only the fields for the type about to display.
     * @param {*} uiDefOrderedFields 
     * @param {*} layerUIFieldsList 
     */
    _getOrderedFieldList(uiDefFields, layerUIFieldsList) {
        let orderedUIDefFields = uiDefFields.sort((a, b) => a.order - b.order);
        let orderedLayerUIFields = [];
        //find the corresponding layerField and place in correct ordered array
        orderedUIDefFields.map(item => {

            let infoToAdd = layerUIFieldsList.find(layerUI => {
                return layerUI.name === item.id;
            });
            if (infoToAdd) {
                orderedLayerUIFields.push(infoToAdd);
            }
        })
        return orderedLayerUIFields;
    }

    
   
    
    /**TODOOOOO---Remove from strikeForm--have copied to index.js as it can be used in another function.--------------
     * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!DOOOOO----------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     */
    _orderUIConfDef(layerName) {
        let uiDefFields = [];
        this.props.uiConfigDef.forEach(item => {
            //  console.log("type:",item.type);
            let itemToReturn = item.type.toUpperCase().indexOf(layerName) !== -1 && item.shouldDisplay === true;
            if (itemToReturn) {
                uiDefFields.push(item);
            }
        });
        return uiDefFields;
    }

    //    _renderForm(layerLbl, readOrEditMode, objectId, index, parentIndex) {

    _renderForm(){
        let layerLbl=this.props.layerLbl;
        let readOrEditMode=this.props.readOrEditMode;
        let objectId=this.props.objectId
        let index=this.props.index; 
        let parentIndex=this.props.parentIndex;
        console.log("in render form", this.props)
        if (this.props.data.uiFields && this.props.data.uiFields.entries) {
            let layerNameBase=this.props.appConfig.APP_SCHEMA_NAME!=undefined && this.props.appConfig.APP_SCHEMA_NAME.length>0?this.props.appConfig.APP_SCHEMA_NAME.concat("."):"";
            let layerName=layerNameBase.concat(this.props.appConfig.layerIdMap.get(layerLbl).layerName);
            let orderedLayerUIFields = this._getOrderedFieldList(this._orderUIConfDef(layerLbl), this.props.data.uiFields.get(layerName))
            let editElemMap = new Map();

            let formUI = orderedLayerUIFields.map(function (uiField) {
                //console.log("uiField", uiField);
                return (<ViewWithRenderFormComponent uiField={uiField} layerName={this.props.appConfig.layerIdMap.get(layerLbl).appConfigLayerName} editElemMap={editElemMap} hasMulti={this.props.appConfig.layerIdMap.get(layerLbl).hasMulti} 
                readOrEditMode={readOrEditMode} objectId={objectId} index={index} parentIndex={parentIndex} mustPopulate={this._mustPopulate}  {...this.props}/>);
            }, this);
            if (this.props.data.editElemMap == undefined || this.props.data.editElemMap === null || (this.props.data.editElemMap !== null && this.props.data.editElemMap.get(layerLbl) === undefined)) {
                this.props.handleEditElemMapSet(layerLbl, editElemMap);
            }
            return formUI;
        }
    }

   
 

    render(){
        return this._renderForm()
    }

    
}
