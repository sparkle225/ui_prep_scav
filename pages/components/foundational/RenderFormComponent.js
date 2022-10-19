import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//import Select from 'react-select';

let { SelectInput, TextAreaInput, TextInput } = require('./ViewComponents.js');
//import Location from '../Location/Location.js';
import ErrorBoundary from './ErrorBoundary.js';

export default class RenderFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this._getComponentBasedOnFieldType =
      this._getComponentBasedOnFieldType.bind(this);
  }

  componentDidUpdate() {
    if (this.props.idToFocus != null) {
      if (
        document.activeElement != document.getElementById(this.props.idToFocus)
      ) {
        // alert(document.activeElement.id);
        console.log('activeElem', document.activeElement);
        this.props.setTableFocus();
      }
    }
  }

  _getDefaultValue(
    hasMulti,
    objectId,
    index,
    readOrEditMode,
    uiFieldDefEntry,
    listName,
    isSelect,
    isMultiSelect
  ) {
    let defaultValToSet;
    if (hasMulti) {
      if (
        objectId != undefined &&
        (readOrEditMode === this.props.appConfig.MODE_VIEW ||
          readOrEditMode === this.props.appConfig.MODE_EDIT)
      ) {
        defaultValToSet = this.props.data[listName][index][uiFieldDefEntry.id];
      } else {
        defaultValToSet =
          this.props.data[uiFieldDefEntry.type][uiFieldDefEntry.id];
      }
    } else {
      defaultValToSet =
        this.props.data[uiFieldDefEntry.type][uiFieldDefEntry.id];
    }
    if (
      (isSelect && defaultValToSet === null) ||
      (isSelect && defaultValToSet == undefined)
    ) {
      return '';
    }
    if (isMultiSelect && defaultValToSet === null) {
      return [];
    }
    return defaultValToSet;
  }

  _getKey(hasMulti, index, listName, elemNameStr) {
    let key = elemNameStr;
    if (hasMulti) {
      key.concat(listName).concat(index);
    }
    return key;
  }

  _attachmentToUploadField(itemId, name, classes, attachments, readonly) {
    console.log('attachments to upload', JSON.parse(attachments));
    let attachmentsJson = [];
    attachmentsJson = JSON.parse(attachments);
    return attachmentsJson.map((attachment, i) => {
      return (
        <li key={i} className="attachmentList">
          {' '}
          <i className="fa fa-file"></i> {attachment.name}{' '}
          <span
            className="btn-sm btn btn-warning attachmentBtn"
            onClick={this.props.removeAttachmentToBeUploaded.bind(this, i)}
          >
            Delete
          </span>
        </li>
      );
    });
  }
  _fileField(itemId, name, classes, readonly) {
    return (
      <div className="row">
        <div className="col-xs-9">
          <input
            ref={(elem) => (this.addAttachmentRef = elem)}
            multiple
            readOnly={readonly}
            type="file"
            id={itemId}
            className={classes}
          />
        </div>{' '}
        <div className="col-xs-2">
          <span
            className="btn-sm btn btn-success"
            onClick={(e) => this.props.submitFile(this.addAttachmentRef, e)}
          >
            Attach
          </span>
        </div>
      </div>
    );
  }

  _isTypeEditing(type) {
    if (
      this.props.typeEditing != undefined &&
      this.props.typeEditing != null &&
      this.props.typeEditing.toLowerCase() === type.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  }

  _addCssClasses(type, error, isRequired) {
    if (this._isTypeEditing(type)) {
      let hasError = error && error.length > 0 ? 'has-error' : '';
      let required = isRequired ? ' required' : '';
      // console.log("required:", required);
      return hasError.concat(required);
    } else {
      return '';
    }
  }

  _getComponentBasedOnFieldType() {
    let uiFieldDef = this.props.uiField;
    let layerName = this.props.layerName;
    let editElemMap = this.props.editElemMap;
    let hasMulti = this.props.hasMulti;
    let readOrEditMode = this.props.readOrEditMode;
    let objectId =
      this.props.objectId != undefined
        ? this.props.objectId
        : this.props.idInfo != undefined &&
          this.props.idInfo.objectId != undefined
        ? this.props.idInfo.objectId
        : undefined;
    let index =
      this.props.index != undefined
        ? this.props.index
        : this.props.idInfo != undefined && this.props.idInfo.index != undefined
        ? this.props.idInfo.index
        : undefined;
    let parentIndex =
      this.props.parentIndex != undefined
        ? this.props.parentIndex
        : this.props.idInfo != undefined &&
          this.props.idInfo.parentIndex != undefined
        ? this.props.idInfo.parentIndex
        : undefined;
    //console.log("readOrEditMode", readOrEditMode);
    //console.log("objectId", objectId);

    const isEdit =
      this.props.editing == true || this.props.editing == undefined;
    //console.log("uiFieldDef", uiFieldDef);
    // console.log("layerName", layerName);
    let uiFieldDefKey = layerName.concat('.').concat(uiFieldDef.name);
    let uiFieldDefEntry = this.props.uiConfigDef.get(uiFieldDefKey);
    //let uiFieldDefEntry = this.props.uiConfigDef.get(uiFieldDefKey);
    if (uiFieldDefEntry != null && uiFieldDefEntry.shouldDisplay) {
      let fieldLabelText, labelContent, fieldname, contentToReturn;

      if (uiFieldDefEntry.viewLabel) {
        fieldLabelText = uiFieldDefEntry.viewLabel;
      } else if (uiFieldDef.alias) {
        fieldLabelText = uiFieldDef.alias;
      } else {
        fieldLabelText = uiFieldDef.name;
      }
      fieldname = uiFieldDef.name;
      // console.log("uiFieldDef.displayType", uiFieldDef);
      //Condition to check if a checkbox is required for integer fields in user form
      let layer = this.props.appConfig.layerIdMap.get(
        uiFieldDefEntry.type.toUpperCase()
      );
      let booleanFields = this.props.appConfig.layerIdMap.get(
        uiFieldDefEntry.type.toUpperCase()
      ).booleanFields;
      if (uiFieldDef.displayType && uiFieldDef.displayType === 'checkbox') {
        uiFieldDef.type = 'binaryInteger';
      } else if (uiFieldDefEntry.domain) {
        uiFieldDef.type = 'select';
        if (
          this.props.appConfig.layerIdMap
            .get(uiFieldDefEntry.type.toUpperCase())
            .multiSelectFields.includes(uiFieldDef.name)
        ) {
          uiFieldDef.type = 'multiselect';
          //  console.log("multiselect-fieldname", uiFieldDef.name);
        }
      } else if (
        uiFieldDef.name.indexOf(
          this.props.appConfig.ATTACHMENT_FIELDNAME_REGEX_CONTAINS
        ) !== -1
      ) {
        uiFieldDef.type = 'fileInput';
      } else if (booleanFields.includes(uiFieldDef.name)) {
        uiFieldDef.type = 'binaryInteger';
      } else if (
        this.props.appConfig.LOCATION_FIELDNAME_REGEX.includes(uiFieldDef.name)
      ) {
        if (
          this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode)
        ) {
          //   console.log("isEditLoc", !this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode));
          uiFieldDef.type = 'location';
        }
      } else if (
        this.props.appConfig.layerIdMap
          .get(uiFieldDefEntry.type.toUpperCase())
          .textAreaFields.includes(uiFieldDef.name)
      ) {
        uiFieldDef.displayType = 'textarea';
      }

      let elemNameStr, listName; //,defaultValToSet;
      if (hasMulti) {
        if (
          objectId != undefined &&
          readOrEditMode === this.props.appConfig.MODE_VIEW
        ) {
          elemNameStr = uiFieldDefEntry.type
            .concat('.')
            .concat(uiFieldDefEntry.id)
            .concat('#')
            .concat(objectId);
          //defaultValToSet=this.props.data[uiFieldDefEntry.type][index][uiFieldDefEntry.id];
        } else {
          elemNameStr = uiFieldDefEntry.type
            .concat('.')
            .concat(uiFieldDefEntry.id)
            .concat('#')
            .concat(index);
          //defaultValToSet=this.props.data[uiFieldDefEntry.type][uiFieldDefEntry.id];
        }
      } else {
        elemNameStr = uiFieldDefEntry.type
          .toLowerCase()
          .concat('.')
          .concat(uiFieldDefEntry.id);
        //  defaultValToSet=this.props.data[uiFieldDefEntry.type][uiFieldDefEntry.id];
      }
      editElemMap.set(uiFieldDefEntry.id, elemNameStr);
      // console.log("elemNameStr", elemNameStr);
      listName = this.props.appConfig.layerIdMap.get(
        uiFieldDefEntry.type.toUpperCase()
      ).listName;
      let isRequired = this.props.mustPopulate(uiFieldDefEntry, readOrEditMode);
      //console.log("elemNameStr:",elemNameStr," required?", isRequired, "readOrEditMode",readOrEditMode);

      // if (currentField.displayType !== "checkbox" || currentField.domain) {
      ////!!!!!add in required start here somewhere
      if (
        (this.props.hideLabel != undefined && !this.props.edit) ||
        this.props.hideLabel == undefined
      ) {
        labelContent = (
          <label
            className={'control-label labelTitle '.concat(
              this._addCssClasses(
                uiFieldDefEntry.type,
                this.props.data.errorMap.get(elemNameStr),
                isRequired
              )
            )}
            htmlFor={elemNameStr}
            title={uiFieldDefEntry.tooltip || ''}
          >
            {fieldLabelText}
          </label>
        );
      }
      /*let contentToReturn=<div className="form-group">
             {labelContent}
             <TextInput readonly={this.props.notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} disabled={this.props.notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} itemId={uiFieldDefEntry.stateObjPathToSave} name={uiFieldDefEntry.stateObjPathToSave} inputType="number" classes={"display-text text-left"} placeholder="enter text" defaultValue={uiFieldDefEntry.stateObjPathToSave} onChange={uiFieldDefEntry.handleInputChange} editing={this.props.editing} maxlength={uiFieldDef.length} />
                 </div>;
             console.log("content to return", contentToReturn);
             return contentToReturn;
          /*return (
                 <div className="form-group">
                     {labelContent}
                     <TextInput readonly={this.props.notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} disabled={this.props.notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} itemId={uiFieldDefEntry.stateObjPathToSave} name={uiFieldDefEntry.stateObjPathToSave} inputType="number" classes={"display-text text-left"} placeholder="enter text" defaultValue={uiFieldDefEntry.stateObjPathToSave} onChange={uiFieldDefEntry.handleInputChange} editing={this.props.editing} maxlength={uiFieldDef.length} />
                 </div>);
 
             */
      let divCss = 'form-group';
      if (this.props.hideLabel == undefined) {
        divCss = divCss.concat(' col-md-3');
      }

      switch (uiFieldDef.type) {
        case 'select':
          //  console.log("uiFieldDefEntry.domain", uiFieldDefEntry.domain);
          if (
            uiFieldDefEntry.type === 'munition' &&
            uiFieldDefEntry.id === 'ASSETAIRCRAFTCD'
          ) {
            // console.log("this.props.data.engagements[parentIndex]", this.props.data.engagements[parentIndex]);
          }
          // console.log("{this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode)}",this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode));
          // console.log("{(uiFieldDefEntry.type === 'munition' && uiFieldDefEntry.id === 'ASSETAIRCRAFTCD') ? this.props.data.assetAircraftItems !== undefined ? this.props.data.assetAircraftItems : this.props.selectOptions.get(uiFieldDefEntry.domain) : this.props.selectOptions.get(uiFieldDefEntry.domain)} editing={this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode)}",(uiFieldDefEntry.type === "munition" && uiFieldDefEntry.id === "ASSETAIRCRAFTCD") ? this.props.data.assetAircraftItems !== undefined ? this.props.data.assetAircraftItems : this.props.selectOptions.get(uiFieldDefEntry.domain) : this.props.selectOptions.get(uiFieldDefEntry.domain),"editing:",this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode));
          // console.log("{this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, true)}",this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, true));
          contentToReturn = this.props.selectOptions.get(uiFieldDefEntry.domain)
            .length > 0 && (
            <div className={divCss}>
              {labelContent}
              <SelectInput
                readonly={this.props.notAbleToEditItem(uiFieldDefEntry)}
                disabled={this.props.notAbleToEditItem(uiFieldDefEntry)}
                itemId={this._getKey(hasMulti, index, listName, elemNameStr)}
                name={this._getKey(hasMulti, index, listName, elemNameStr)}
                key={this._getKey(hasMulti, index, listName, elemNameStr)}
                defaultValue={this._getDefaultValue(
                  hasMulti,
                  objectId,
                  index,
                  readOrEditMode,
                  uiFieldDefEntry,
                  listName,
                  true
                )}
                value={this._getDefaultValue(
                  hasMulti,
                  objectId,
                  index,
                  readOrEditMode,
                  uiFieldDefEntry,
                  listName,
                  true
                )}
                onChange={(e) =>
                  this.props.handleInputSelectChange(
                    e,
                    uiFieldDefEntry.type,
                    uiFieldDefEntry.id,
                    index,
                    hasMulti,
                    uiFieldDefEntry.idField,
                    uiFieldDefEntry.domain
                  )
                }
                options={
                  uiFieldDefEntry.type === 'munition' &&
                  uiFieldDefEntry.id === 'ASSETAIRCRAFTCD'
                    ? this.props.data.assetAircraftItems !== undefined
                      ? this.props.data.assetAircraftItems
                      : this.props.selectOptions.get(uiFieldDefEntry.domain)
                    : this.props.selectOptions.get(uiFieldDefEntry.domain)
                }
                editing={this.props.shouldDisplayEdit(
                  uiFieldDefEntry.type,
                  readOrEditMode
                )}
                handleSelectGetValue={this.props.handleSelectGetValue}
                classes={
                  this.props.extraCss != undefined &&
                  this.props.extraCss != null &&
                  this.props.extraCss.length > 0
                    ? ' '.concat(this.props.extraCss)
                    : ''
                }
                classes={
                  this.props.extraCss != undefined &&
                  this.props.extraCss != null &&
                  this.props.extraCss.length > 0
                    ? ' '.concat(this.props.extraCss)
                    : ''
                }
              />
              <div
                className={this._addCssClasses(
                  uiFieldDefEntry.type,
                  this.props.data.errorMap.get(elemNameStr),
                  isRequired
                )}
              >
                {this.props.data.errorMap.get(elemNameStr)
                  ? this.props.data.errorMap.get(elemNameStr)
                  : ''}
              </div>
            </div>
          );
          //console.log("select", contentToReturn);
          break;
        case 'multiselect':
          /** --REACT-SELECT LIB not loading need to determine how works with NEXTJS- Can't find recat!!!
                    //    console.log("{this.props.selectOptions.get(uiFieldDefEntry.domain)}",this.props.selectOptions.get(uiFieldDefEntry.domain));
                    contentToReturn = this.props.selectOptions.get(uiFieldDefEntry.domain).length > 0 && (
                        <div className={divCss}>
                            {labelContent}
                            {this.props.shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode) ?
                                <Select isMulti={true} readonly={this.props.notAbleToEditItem(uiFieldDefEntry)} isDisabled={this.props.notAbleToEditItem(uiFieldDefEntry)} itemId={this._getKey(hasMulti, index, listName,elemNameStr)} name={this._getKey(hasMulti, index, listName,elemNameStr)} value={this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true)} onChange={(e) => this.props.handleInputMultiSelectChange(e, uiFieldDefEntry.type, uiFieldDefEntry.id, index, hasMulti, uiFieldDefEntry.idField, uiFieldDefEntry.domain)}
                                    className=" form-control" classNamePrefix="form-control" options={this.props.selectOptions.get(uiFieldDefEntry.domain)} defaultValue={this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true)}  classes={this.props.extraCss!=undefined && this.props.extraCss!=null && this.props.extraCss.length>0?" ".concat(this.props.extraCss):''}/>
                                :
                                (<div className={this.props.classes + ' field-view-only'}>{(this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true) !== undefined && this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true) !== null && (Array.isArray(this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true)) && this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true).length !== 0) ? this.props.handleMultiSelectGetValue(this.props.selectOptions.get(uiFieldDefEntry.domain), this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName, false, true)) : "No Data")}</div>)
                            }

                            <div className={this._addCssClasses(uiFieldDefEntry.type,this.props.data.errorMap.get(elemNameStr), isRequired)}>{this.props.data.errorMap.get(elemNameStr) ? this.props.data.errorMap.get(elemNameStr) : ""}</div>
                        </div>)*/
          break;
        case 'fileInput':
          contentToReturn = (
            <div className="form-group">
              {labelContent}
              {this.props.shouldDisplayEdit(
                uiFieldDefEntry.type,
                readOrEditMode
              ) && this.props.data.attachmentsToUpload.length > 0 ? (
                <div className="row">
                  <label
                    htmlFor={elemNameStr}
                    className="display-label col-xs-3 text-left"
                  >
                    Attachments to Upload (
                    {this.props.data.attachmentsToUpload.length})
                  </label>
                  <div className="col-xs-8 attachments">
                    <ul className="attachmentList">
                      {this._attachmentToUploadField(
                        elemNameStr,
                        elemNameStr,
                        'display-text text-left',
                        JSON.stringify(this.props.data.attachmentsToUpload),
                        this.props.notAbleToEditItem(uiFieldDefEntry)
                      )}
                    </ul>
                  </div>
                </div>
              ) : null}
              {this.props.shouldDisplayEdit(
                uiFieldDefEntry.type,
                readOrEditMode
              ) ? (
                <div className="row">
                  <label
                    htmlFor={elemNameStr}
                    className="display-label col-xs-3 text-left"
                  >
                    Add Attachments{' '}
                  </label>
                  <div className="col-xs-9">
                    {this._fileField(
                      elemNameStr,
                      elemNameStr,
                      'display-text text-left fileBrowseInput',
                      this.props.notAbleToEditItem(uiFieldDefEntry)
                    )}
                  </div>
                  <div
                    className={this._addCssClasses(
                      uiFieldDefEntry.type,
                      this.props.data.errorMap.get(elemNameStr),
                      isRequired
                    )}
                  >
                    {this.props.data.errorMap.get(elemNameStr)
                      ? this.props.data.errorMap.get(elemNameStr)
                      : ''}
                  </div>
                </div>
              ) : null}
            </div>
          );
          break;
        /**   case 'location':
          contentToReturn = (
            <div className="form-group col-md-6">
              {labelContent}
              {this.props.hideLabel ? (
                <TextInput
                  readonly={true}
                  disabled={true}
                  itemId={elemNameStr}
                  name={elemNameStr}
                  inputType="text"
                  classes={'display-text text-left'}
                  placeholder="enter text"
                  defaultValue={this.props.renderLocationInfo(
                    null,
                    this.props.data[uiFieldDefEntry.type]
                  )}
                  value={this.props.renderLocationInfo(
                    null,
                    this.props.data[uiFieldDefEntry.type]
                  )}
                  onChange={(e) =>
                    this.props.handleInputChange(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti
                    )
                  }
                  editing={false}
                  classes={
                    this.props.extraCss != undefined &&
                    this.props.extraCss != null &&
                    this.props.extraCss.length > 0
                      ? ' '.concat(this.props.extraCss)
                      : ''
                  }
                />
              ) : (
                <TextInput
                  readonly={this.props.notAbleToEditItem(uiFieldDefEntry)}
                  disabled={this.props.notAbleToEditItem(uiFieldDefEntry)}
                  itemId={elemNameStr}
                  name={elemNameStr}
                  inputType="text"
                  classes={'display-text text-left'}
                  placeholder="enter text"
                  defaultValue={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  )}
                  value={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  )}
                  onChange={(e) =>
                    this.props.handleInputChange(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti
                    )
                  }
                  editing={this.props.shouldDisplayEdit(
                    uiFieldDefEntry.type,
                    readOrEditMode
                  )}
                  classes={
                    this.props.extraCss != undefined &&
                    this.props.extraCss != null &&
                    this.props.extraCss.length > 0
                      ? ' '.concat(this.props.extraCss)
                      : ''
                  }
                />
              )}

              <ErrorBoundary appConfig={this.props.appConfig}>
                <Location
                  itemId="location"
                  name="location"
                  appConfig={this.props.appConfig}
                  placename={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  )}
                  locationData={this.props.handleLocationInputs}
                  edit={this.props.edit}
                  type={uiFieldDefEntry.type}
                  africanCountryInfo={this.props.africanCountryInfo}
                  index={index}
                />
              </ErrorBoundary>
            </div>
          );
          break;*/
        case 'esriFieldTypeString':
          if (uiFieldDef.displayType === 'textarea') {
            //-------textArea----{this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName)}---{elemNameStr}
            contentToReturn = (
              <div
                className={'form-group col-md-12 '.concat(
                  this._addCssClasses(
                    uiFieldDefEntry.type,
                    this.props.data.errorMap.get(elemNameStr),
                    isRequired
                  )
                )}
              >
                {labelContent}
                {isEdit ? (
                  <TextAreaInput
                    readonly={this.props.notAbleToEditItem(uiFieldDefEntry)}
                    disabled={this.props.notAbleToEditItem(uiFieldDefEntry)}
                    style={{ width: '100%' }}
                    itemId={elemNameStr}
                    name={elemNameStr}
                    key={this._getKey(hasMulti, index, listName, elemNameStr)}
                    classes={'display-text text-left '.concat(
                      this._addCssClasses(
                        uiFieldDefEntry.type,
                        this.props.data.errorMap.get(elemNameStr),
                        isRequired
                      )
                    )}
                    placeholder="enter text"
                    inputType="text"
                    defaultValue={this._getDefaultValue(
                      hasMulti,
                      objectId,
                      index,
                      readOrEditMode,
                      uiFieldDefEntry,
                      listName
                    )}
                    onChange={(e) =>
                      this.props.handleInputChange(
                        e,
                        uiFieldDefEntry.type,
                        uiFieldDefEntry.id,
                        index,
                        hasMulti
                      )
                    }
                    editing={this.props.shouldDisplayEdit(
                      uiFieldDefEntry.type,
                      readOrEditMode
                    )}
                    maxlength={uiFieldDef.length}
                    onBlur={(e) =>
                      this.props.handleInputBlur(
                        e,
                        uiFieldDefEntry.type,
                        uiFieldDefEntry.id,
                        index,
                        hasMulti
                      )
                    }
                    classes={
                      this.props.extraCss != undefined &&
                      this.props.extraCss != null &&
                      this.props.extraCss.length > 0
                        ? ' '.concat(this.props.extraCss)
                        : ''
                    }
                  />
                ) : null}
                <div
                  className={this._addCssClasses(
                    uiFieldDefEntry.type,
                    this.props.data.errorMap.get(elemNameStr),
                    isRequired
                  )}
                >
                  {this.props.data.errorMap.get(elemNameStr)
                    ? this.props.data.errorMap.get(elemNameStr)
                    : ''}
                </div>
              </div>
            );
          } else {
            //--{this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName)}--{elemNameStr}
            contentToReturn = (
              <div
                className={divCss.concat(
                  this._addCssClasses(
                    uiFieldDefEntry.type,
                    this.props.data.errorMap.get(elemNameStr),
                    isRequired
                  )
                )}
              >
                {labelContent}
                <TextInput
                  readonly={this.props.notAbleToEditItem(uiFieldDefEntry)}
                  disabled={this.props.notAbleToEditItem(uiFieldDefEntry)}
                  itemId={elemNameStr}
                  name={elemNameStr}
                  key={this._getKey(hasMulti, index, listName, elemNameStr)}
                  inputType="text"
                  classes={'display-text text-left '.concat(
                    this._addCssClasses(
                      uiFieldDefEntry.type,
                      this.props.data.errorMap.get(elemNameStr),
                      isRequired
                    )
                  )}
                  placeholder="enter text"
                  defaultValue={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  )}
                  onChange={(e) =>
                    this.props.handleInputChange(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti
                    )
                  }
                  value={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  )}
                  onChange={(e) =>
                    this.props.handleInputChange(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti
                    )
                  }
                  editing={this.props.shouldDisplayEdit(
                    uiFieldDefEntry.type,
                    readOrEditMode
                  )}
                  onBlur={(e) =>
                    this.props.handleInputBlur(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti
                    )
                  }
                  classes={
                    this.props.extraCss != undefined &&
                    this.props.extraCss != null &&
                    this.props.extraCss.length > 0
                      ? ' '.concat(this.props.extraCss)
                      : ''
                  }
                />
                <div
                  className={this._addCssClasses(
                    uiFieldDefEntry.type,
                    this.props.data.errorMap.get(elemNameStr),
                    isRequired
                  )}
                >
                  {this.props.data.errorMap.get(elemNameStr)
                    ? this.props.data.errorMap.get(elemNameStr)
                    : ''}
                </div>
              </div>
            );
          }
          break;
        case 'binaryInteger':
          contentToReturn = (
            <div
              className={divCss.concat(
                this._addCssClasses(
                  uiFieldDefEntry.type,
                  this.props.data.errorMap.get(elemNameStr),
                  isRequired
                )
              )}
            >
              {labelContent}
              {this.props.shouldDisplayEdit(
                uiFieldDefEntry.type,
                readOrEditMode
              ) ? (
                React.createElement('input', {
                  type: 'checkbox',
                  disabled: this.props.notAbleToEditItem(uiFieldDefEntry),
                  id: elemNameStr,
                  name: elemNameStr,
                  key: this._getKey(hasMulti, index, listName, elemNameStr),
                  className: 'checkboxContainer' + ' field-view-only',
                  checked:
                    this._getDefaultValue(
                      hasMulti,
                      objectId,
                      index,
                      readOrEditMode,
                      uiFieldDefEntry,
                      listName
                    ) == 1
                      ? true
                      : false,
                  onChange: (e) =>
                    this.props.handleInputChange(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti
                    ),
                  classes:
                    this.props.extraCss != undefined &&
                    this.props.extraCss != null &&
                    this.props.extraCss.length > 0
                      ? ' '.concat(this.props.extraCss)
                      : '',
                })
              ) : (
                <div
                  id={elemNameStr}
                  name={elemNameStr}
                  className={'checkboxContainer' + ' field-view-only'}
                >
                  {this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  ) == 1
                    ? 'TRUE'
                    : 'FALSE'}
                </div>
              )}
            </div>
          );
          break;
        case 'esriFieldTypeSmallInteger':
        case 'esriFieldTypeInteger':
        case 'esriFieldTypeDouble':
          //--double--{this._getDefaultValue(hasMulti, objectId, index, readOrEditMode, uiFieldDefEntry, listName)}---{elemNameStr}
          contentToReturn = (
            <div className={divCss}>
              {labelContent}
              <TextInput
                readonly={this.props.notAbleToEditItem(uiFieldDefEntry)}
                disabled={this.props.notAbleToEditItem(uiFieldDefEntry)}
                itemId={elemNameStr}
                name={elemNameStr}
                key={this._getKey(hasMulti, index, listName, elemNameStr)}
                inputType="number"
                classes={'display-text text-left'}
                placeholder="enter text"
                defaultValue={this._getDefaultValue(
                  hasMulti,
                  objectId,
                  index,
                  readOrEditMode,
                  uiFieldDefEntry,
                  listName
                )}
                value={this._getDefaultValue(
                  hasMulti,
                  objectId,
                  index,
                  readOrEditMode,
                  uiFieldDefEntry,
                  listName
                )}
                onChange={(e) =>
                  this.props.handleInputChange(
                    e,
                    uiFieldDefEntry.type,
                    uiFieldDefEntry.id,
                    index,
                    hasMulti
                  )
                }
                editing={this.props.shouldDisplayEdit(
                  uiFieldDefEntry.type,
                  readOrEditMode
                )}
                min="0.0"
                onBlur={(e) =>
                  this.props.handleInputBlur(
                    e,
                    uiFieldDefEntry.type,
                    uiFieldDefEntry.id,
                    index,
                    hasMulti
                  )
                }
                classes={
                  this.props.extraCss != undefined &&
                  this.props.extraCss != null &&
                  this.props.extraCss.length > 0
                    ? ' '.concat(this.props.extraCss)
                    : ''
                }
              />
              <div
                className={this._addCssClasses(
                  uiFieldDefEntry.type,
                  this.props.data.errorMap.get(elemNameStr),
                  isRequired
                )}
              >
                {this.props.data.errorMap.get(elemNameStr)
                  ? this.props.data.errorMap.get(elemNameStr)
                  : ''}
              </div>
            </div>
          );
          break;
        case 'esriFieldTypeDate':
          contentToReturn = this.props.shouldDisplayEdit(
            uiFieldDefEntry.type,
            readOrEditMode
          ) ? (
            <div className={divCss}>
              {labelContent}
              <DatePicker
                readOnly={this.props.notAbleToEditItem(uiFieldDefEntry)}
                disabled={this.props.notAbleToEditItem(uiFieldDefEntry)}
                name={elemNameStr}
                className={'form-control'.concat(
                  this.props.extraCss != undefined &&
                    this.props.extraCss != null &&
                    this.props.extraCss.length > 0
                    ? ' '.concat(this.props.extraCss)
                    : ''
                )}
                selected={this.props.handleDateSelected(
                  uiFieldDefEntry.type,
                  uiFieldDefEntry.id,
                  this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  ),
                  index,
                  hasMulti
                )}
                startDate={this.props.handleDateStart(
                  uiFieldDefEntry.type,
                  uiFieldDefEntry.id,
                  this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  ),
                  index,
                  hasMulti
                )}
                onChange={(e) =>
                  this.props.handleDateChange(
                    e,
                    uiFieldDefEntry.type,
                    uiFieldDefEntry.id,
                    index,
                    hasMulti,
                    null
                  )
                }
                timeFormat="HH:mm"
                dateFormat="yyyy-MM-dd'T'h:mm'Z'"
                showTimeSelect
                timeIntervals={1}
                timeCaption="time"
                onBlur={(e) =>
                  this.props.handleDateBlur(
                    e,
                    uiFieldDefEntry.type,
                    uiFieldDefEntry.id,
                    index,
                    hasMulti,
                    null
                  )
                }
                minDate={this.props.handleDateMinCheck(uiFieldDefEntry.id)}
                //!== "STRIKESTARTDTG" && this.props.data.strike.STRIKESTARTDTG !== null ? moment(this.props.data.strike.STRIKESTARTDTG) : null}
                // minTime={uiFieldDefEntry.id !== "STRIKESTARTDTG" && this.props.data.strike.STRIKESTARTDTG !== null? moment(this.props.data.strike.STRIKESTARTDTG): 0}
                // maxTime={uiFieldDefEntry.id !== "STRIKEENDDTG" && this.props.data.strike.STRIKEENDDTG !== null? moment(this.props.data.strike.STRIKEENDDTG): 0}
                maxDate={this.props.handleDateMaxCheck(uiFieldDefEntry.id)}
                // !== "STRIKEENDDTG" && this.props.data.strike.STRIKEENDDTG !== null ? moment(this.props.data.strike.STRIKEENDDTG) : null}
                required
              />

              <div
                className={this._addCssClasses(
                  uiFieldDefEntry.type,
                  uiFieldDefEntry.type,
                  this.props.data.errorMap.get(elemNameStr),
                  isRequired
                )}
              >
                {this.props.data.errorMap.get(elemNameStr)
                  ? this.props.data.errorMap.get(elemNameStr)
                  : ''}
              </div>
            </div>
          ) : (
            <div className="form-group col-md-3">
              {labelContent}
              <div
                id={uiFieldDefEntry.stateObjPathToSave}
                className={this.props.classes + ' field-view-only'}
              >
                {this.props.handleDateReadDisplay(
                  uiFieldDefEntry.type,
                  uiFieldDefEntry.id,
                  this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName
                  ),
                  index,
                  hasMulti
                )}
              </div>
            </div>
          );
          break;
      }
      return contentToReturn;
    }
  }

  render() {
    return (
      <React.Fragment>{this._getComponentBasedOnFieldType()}</React.Fragment>
    );
  }
}
