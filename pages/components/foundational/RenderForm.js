import React from 'react';


//import styles from "./index.css"; //uncomment this line prior to webpacking for deployment

//import "../lib/react-datepicker/react-datepicker.scss";
let { SelectInput, TextAreaInput, TextInput } = require('./ViewComponents.js');
//import Location from '../Location/Location.js';

import ErrorBoundary from './ErrorBoundary.js';
import moment from 'moment';

export default class RenderForm extends React.Component {
  constructor(props) {
    super(props);

    this._notAbleToEditItem = this._notAbleToEditItem.bind(this);
    //this._isAdmin = this._isAdmin.bind(this);
    this._renderForm = this._renderForm.bind(this);
    this._getComponentBasedOnFieldType =
      this._getComponentBasedOnFieldType.bind(this);
    this._shouldDisableField = this._shouldDisableField.bind(this);
    this._shouldDisplayEdit = this._shouldDisplayEdit.bind(this);
    this._itemEditing = this._itemEditing.bind(this);
    this._getDefaultValue = this._getDefaultValue.bind(this);
    this._validate = this._validate.bind(this);
    this._executeFunctionByName = this._executeFunctionByName.bind(this);

    // this._fileField=this._fileField.bind(this);
  }

  /* shouldComponentUpdate(props) {
      //  console.log("RECIEVING shouldComponentUpdate-PROPS", props.data);
        if (this.props.data.strike.LOC_LATITUDE !== props.data.strike.LOC_LATITUDE) {
            console.log("need to do something to this data", props.data);
        }
        return true;
    }

    componentWillReceiveProps(nextprops) {
        console.log("RECIEVING PROPS")
        if (this.props.data.strike.LOC_LATITUDE !== nextprops.data.strike.LOC_LATITUDE) {
            console.log("need to do something to this data", nextprops.data);

            this.setState({ data: nextprops.data });
        }
    } */

  _executeFunctionByName(functionName, context /*,arguments*/) {
    let args = Array.prototype.slice.call(arguments, 2);
    let namespaces = functionName.split('.');
    let func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }

  textField(itemId, name, classes, value, readonly) {
    return (
      <TextInput
        readonly={readonly}
        itemId={itemId}
        name={name}
        classes={classes + ' form-control'}
        placeholder="enter text"
        defaultValue={value}
        onChange={this.props.handleInputChange}
      />
    );
  }

  checkboxField(itemId, name, classes, value, readonly) {
    if (value === 'NO') {
      value = false;
    } else if (value === 'YES') {
      value = true;
    }
    return React.createElement('input', {
      type: 'checkbox',
      disabled: readonly,
      id: itemId,
      name: name,
      className: classes,
      checked: value,
      onChange: this.props.handleInputChange,
    });
  }

  //Requires population of user group info
  _notAbleToEditItem(uiFieldDefEntry) {
    //_shouldDisableField
    //return false;
    //console.log("uiFieldDefEntry before determining canedit",uiFieldDefEntry);
    /* console.log("userGrps",this.props.data.userInfo.userGroups);
          console.log("grpsForField", uiFieldDefEntry.grpsCanEdit);
          console.log("InGrp:".concat(uiFieldDefEntry.id),this.props.data.userInfo.userGroups.some(grpId => {let indexOfGrp=uiFieldDefEntry.grpsCanEdit.indexOf(grpId); console.log(grpId.concat(":grpIdIndex:"),indexOfGrp); return indexOfGrp !==-1;}));*/
    let canEdit =
      !this.props.data.userInfo.userGroups.some(
        (grpId) => uiFieldDefEntry.grpsCanEdit.indexOf(grpId.groupID) !== -1
      ) || this._shouldDisableField(uiFieldDefEntry.type, uiFieldDefEntry.id);
    // console.log("finalCanEdit:",canEdit);
    return canEdit;
  }

  _mustPopulate(uiFieldDefEntry, readOrEditMode) {
    //console.log("grpsCanEdit:", uiFieldDefEntry.grpsCanEdit);
    //  console.log("userInfo:", this.props.data.userInfo.userGroups);
    let mustPop;
    if (
      this.props.edit &&
      uiFieldDefEntry.required &&
      uiFieldDefEntry.grpsCanEdit &&
      uiFieldDefEntry.grpsCanEdit.length > 0 &&
      readOrEditMode === this.props.appConfig.MODE_EDIT
    ) {
      mustPop = this.props.data.userInfo.userGroups.some(
        (grpId) => uiFieldDefEntry.grpsCanEdit.indexOf(grpId.groupID) !== -1
      );
    } else {
      mustPop = false;
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
    orderedUIDefFields.map((item) => {
      let infoToAdd = layerUIFieldsList.find((layerUI) => {
        return layerUI.name === item.id;
      });
      if (infoToAdd) {
        orderedLayerUIFields.push(infoToAdd);
      }
    });
    return orderedLayerUIFields;
  }

  async _submitData(type, dataToSave, linkObjType, linkObjId) {
    let errorMap = await this._validate(type, dataToSave);
    if (errorMap && errorMap.size > 0) {
      this.props.handleErrorMapSet(errorMap);
    } else {
      //clear old errors on state if validate pass
      this.props.handleErrorMapSet(errorMap);
      //_storeLayerData(layerName, dataToStore, typeLinkingTo, linkId, auditAction, previousVal, newVal, initiator, shouldUpdateView,isPicklisttUpdate)
      this.props.storeLayerData(
        type,
        dataToSave,
        linkObjType,
        linkObjId,
        null,
        null,
        null,
        null,
        true
      );
    }
  }

  _validate(type, dataToSave) {
    return new Promise((resolve) => {
      try {
        let errors;
        let requiredUiFieldEntries = [];
        let regexValidationEntries = [];
        let uiConfigDefEntryStrikeNum = null;

        let errorMap = new Map();
        for (var key of this.props.uiConfigDef.keys()) {
          let typeFound =
            key.indexOf(
              this.props.appConfig.layerIdMap.get(type).appConfigLayerName
            ) !== -1;
          let uiConfigEntry = this.props.uiConfigDef.get(key);
          if (
            type === this.props.appConfig.STRIKE_TYPE &&
            uiConfigEntry.id === this.props.appConfig.STRIKE_NUM_ID
          ) {
            uiConfigDefEntryStrikeNum = uiConfigEntry;
          }
          let isRequired = false;
          let hasRegEx = uiConfigEntry.regex !== undefined;
          let hasRegExFunction = uiConfigEntry.regexFunction !== undefined;
          //console.log("uiConfigEntry.id:",uiConfigEntry.id," hasRegex:",hasRegEx, "uiConfigEntry.regex", uiConfigEntry.regex," uiConfigEntry",uiConfigEntry);
          if (uiConfigEntry.shouldDisplay === true) {
            isRequired =
              uiConfigEntry.required === true
                ? this._mustPopulate(
                    uiConfigEntry,
                    this.props.appConfig.MODE_EDIT
                  )
                : false;
          }
          if (typeFound && isRequired) {
            requiredUiFieldEntries.push(uiConfigEntry);
          }
          if (
            dataToSave[uiConfigEntry.id] !== undefined &&
            dataToSave[uiConfigEntry.id] !== null &&
            hasRegEx
          ) {
            //special processing validation--
            let regEx = new RegExp(uiConfigEntry.regex, 'g');
            //  console.log("dataToSave[uiConfigEntry.id]",dataToSave[uiConfigEntry.id], " uiConfigEntry.regex",regEx);
            //could throw error on null value
            // console.log("dataToSave[uiConfigEntry.id].match(regEx)",dataToSave[uiConfigEntry.id].match(regEx));
            if (
              uiConfigEntry.regexMatch == true &&
              dataToSave[uiConfigEntry.id].match(regEx) == null
            ) {
              this.props.addError(
                errorMap,
                type,
                uiConfigEntry.id,
                uiConfigEntry.viewLabel,
                uiConfigEntry.viewLabel.concat(
                  this.props.appConfig.FORMAT_BASE_MESSAGE
                )
              );
            } else if (
              uiConfigEntry.regexMatch == false &&
              dataToSave[uiConfigEntry.id].match(regEx) !== null
            ) {
              this.props.addError(
                errorMap,
                type,
                uiConfigEntry.id,
                uiConfigEntry.viewLabel,
                uiConfigEntry.viewLabel.concat(
                  this.props.appConfig.FORMAT_BASE_MESSAGE
                )
              );
            } else {
              if (uiConfigEntry.fieldsToExtract !== undefined) {
                uiConfigEntry.fieldsToExtract.map((fieldIdToExtract) => {
                  let extractUIConfigEntry =
                    this.props.uiConfigDef.get(fieldIdToExtract);
                  let regExtract = new RegExp(
                    extractUIConfigEntry.extractRegex
                  );
                  //console.log("extractUIConfigEntry.extractRegex", regExtract);
                  //console.log("dataToSave[extractUIConfigEntry.extractFieldId].match(extractUIConfigEntry.extractRegex)", dataToSave[extractUIConfigEntry.extractFieldId].match(regExtract));
                  let extractedVal =
                    dataToSave[extractUIConfigEntry.extractFieldId].match(
                      regExtract
                    ) !== null
                      ? dataToSave[extractUIConfigEntry.extractFieldId].match(
                          regExtract
                        )[1]
                      : null;
                  if (extractedVal !== undefined && extractedVal !== null) {
                    console.log(
                      'setting ',
                      extractUIConfigEntry.id,
                      ' to ',
                      extractedVal
                    );
                    dataToSave[extractUIConfigEntry.id] = extractedVal;
                  }
                });
              }
            }
          }

          /*                    if (dataToSave[uiConfigEntry.id] !== undefined && dataToSave[uiConfigEntry.id] !== null && hasRegExFunction) {
                        //special processing validation--
                        this._executeFunctionByName(uiConfigEntry.regexFunction, dataToSave, uiConfigEntry.id, errorMap);{}
                    }*/

          //if Classi
          //   console.log("uiConfigEntry.id.indexOf(this.props.appConfig.CLASSIFICATION_REGEX_CONTAINS) !== -1",uiConfigEntry.id.indexOf(this.props.appConfig.CLASSIFICATION_REGEX_CONTAINS) !== -1);
          //   console.log("dataToSave[uiConfigEntry.id] !== undefined",dataToSave[uiConfigEntry.id] !== undefined);
          if (
            dataToSave[uiConfigEntry.id] !== undefined &&
            typeof dataToSave[uiConfigEntry.id] === 'string'
          ) {
            //   console.log("dataToSave[uiConfigEntry.id]",dataToSave[uiConfigEntry.id]);
            //   console.log("dataToSave[uiConfigEntry.id].indexOf(this.props.appConfig.CLASSIFICATION_QUALIFIER) !== -1",dataToSave[uiConfigEntry.id].indexOf(this.props.appConfig.CLASSIFICATION_QUALIFIER) !== -1);
          }
          if (
            uiConfigEntry.id.indexOf(
              this.props.appConfig.CLASSIFICATION_REGEX_CONTAINS
            ) !== -1 &&
            dataToSave[uiConfigEntry.id] !== undefined &&
            typeof dataToSave[uiConfigEntry.id] === 'string' &&
            dataToSave[uiConfigEntry.id].indexOf(
              this.props.appConfig.CLASSIFICATION_QUALIFIER
            ) !== -1
          ) {
            if (
              this.props.appConfig.layerIdMap.get(type).classificationFields !==
              undefined
            ) {
              for (var classFields of this.props.appConfig.layerIdMap.get(type)
                .classificationFields) {
                if (
                  dataToSave[classFields] === undefined ||
                  dataToSave[classFields] === null ||
                  dataToSave[classFields] === ''
                ) {
                  let classKeyToFind = this.props.appConfig.layerIdMap
                    .get(type)
                    .appConfigLayerName.concat('.')
                    .concat(classFields);
                  let classUiFieldDefEntry =
                    this.props.uiConfigDef.get(classKeyToFind);
                  if (classUiFieldDefEntry.shouldDisplay === true) {
                    this.props.addError(
                      errorMap,
                      type,
                      classUiFieldDefEntry.id,
                      classUiFieldDefEntry.viewLabel,
                      classUiFieldDefEntry.viewLabel.concat(
                        this.props.appConfig
                          .CLASSIFICATION_REQUIRED_BASE_MESSAGE
                      )
                    );
                  }
                }
              }
            }
          }
        }

        //      console.log("requiredUiFieldEntries", requiredUiFieldEntries);

        for (var requiredField of requiredUiFieldEntries) {
          let requiredVal = dataToSave[requiredField.id];
          /*  console.log("requiredVal===undefined", requiredVal === undefined);
                      console.log("requiredVal === null", !requiredVal === null);
                      console.log("requiredVal === ''", !requiredVal === "");
          */
          if (
            requiredVal === undefined ||
            requiredVal === null ||
            requiredVal === ''
          ) {
            if (
              requiredField.id.indexOf(
                this.props.appConfig.ATTACHMENT_FIELDNAME_REGEX_CONTAINS
              ) !== -1
            ) {
              if (
                this.props.data.attachmentsToUpload !== undefined &&
                this.props.data.attachmentsToUpload.length > 0
              ) {
                //do nothing
              } else {
                this.props.addError(errorMap, type, requiredField);
              }
            } else {
              this.props.addError(errorMap, type, requiredField);
            }
          }
        }

        //FIX!!!!!!!BAD BAD code should be somehow configured to use functions for validate--maybe a regex or validate function key --------------------------------------------NEED TO FIX!!!!!!
        /* console.log("uiConfigEntry.id", uiConfigEntry.id);
                 console.log("type===this.props.appConfig.STRIKE_TYPE", type === this.props.appConfig.STRIKE_TYPE);
                 console.log("this.props.strikeId===undefined", this.props.strikeId === undefined);
                 console.log("this.props.strikeId===null", this.props.strikeId === null);
                 console.log("uiConfigEntry.id===this.props.appConfig.STRIKE_NUM_ID", uiConfigEntry.id === this.props.appConfig.STRIKE_NUM_ID);
                 console.log("dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY]!==undefined", dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY] !== undefined);
                 console.log("dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY]!==null", dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY] !== null);*/
        if (
          uiConfigDefEntryStrikeNum !== null &&
          dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY] !==
            undefined &&
          dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY] !== null
        ) {
          this.props
            .isDistinctStrikeNum(
              dataToSave[uiConfigDefEntryStrikeNum.id],
              dataToSave[this.props.appConfig.STRIKE_NUM_VALIDATE_COUNTRY]
            )
            .then((isDistinct) => {
              if (!isDistinct) {
                this.props.addError(
                  errorMap,
                  type,
                  uiConfigDefEntryStrikeNum.id,
                  uiConfigDefEntryStrikeNum.viewLabel,
                  this.props.appConfig.STRIKE_NUM_NOT_DISTINCT_MESSAGE
                );
              }
              resolve(errorMap);
            });
        } else {
          resolve(errorMap);
        }
      } catch (error) {
        //should display error to user..some issue occurred during load.
        console.log('error during validate', error);
      }
    });
  }

  _itemEditing(type, idToCheck) {
    /*console.log(" this._shouldDisplayEdit(type)", this._shouldDisplayEdit(type));
        console.log("this.props.idEditing === idToCheck", this.props.idEditing === idToCheck);
        console.log("this.props.idEditing ", this.props.idEditing);
        console.log("idToCheck ", idToCheck);
        console.log("this.props.idEditing-typeof ", typeof this.props.idEditing);
        console.log("idToCheck-typeof ", typeof idToCheck);*/
    return this._shouldDisplayEdit(type) && this.props.idEditing === idToCheck;
  }

  _shouldDisableField(type, id) {
    let layerInfo = this.props.appConfig['layerIdMap'].get(type.toUpperCase());
    if (layerInfo && layerInfo.disableFieldsToShow.some((val) => id === val)) {
      return true;
    } else {
      return false;
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
        objectId &&
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
    if (isSelect && defaultValToSet === null) {
      return '';
    }
    if (isMultiSelect && defaultValToSet === null) {
      return [];
    }
    return defaultValToSet;
  }

  _shouldDisplayEdit(type, readOrEditMode) {
    if (
      (this.props.edit === true || this.props.edit === undefined) &&
      this.props.typeEditing.toLowerCase() === type.toLowerCase()
    ) {
      if (
        readOrEditMode !== undefined &&
        readOrEditMode === this.props.appConfig.MODE_EDIT
      ) {
        return true;
      } else if (
        readOrEditMode !== undefined &&
        readOrEditMode === this.props.appConfig.MODE_VIEW
      ) {
        return false;
      }
      return true;
    }
    return false;
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

  _attachedFilesField(itemId, name, classes, attachments, readonly) {
    console.log('attachments field', JSON.parse(attachments));
    let attachmentsJson = [];
    attachmentsJson = JSON.parse(attachments);
    return attachmentsJson.map((attachment, i) => {
      return (
        <li key={i} className="attachmentList">
          {' '}
          <a href={attachment.__metadata.media_src} target="#">
            <i className="fa fa-file"></i> {attachment.Name}{' '}
          </a>{' '}
          {(this.props.edit && attachment.todelete === undefined) ||
          (this.props.edit && !attachment.todelete) ? (
            <div
              onClick={this.props.attachmentsToBeDeleted
                .bind(this, attachment, i)
                .bind(this, attachment, i)}
              className="btn-sm btn btn-danger attachmentBtn"
            >
              Delete
            </div>
          ) : this.props.edit && attachment.todelete ? (
            <span
              onClick={this.attachmentsRemoveToBeDeleted.bind(
                this,
                attachment,
                i
              )}
              className="btn-sm btn btn-warning attachmentBtn"
            >
              Undo Delete
            </span>
          ) : null}{' '}
        </li>
      );
    });
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
            onClick={this.removeAttachmentToBeUploaded.bind(this, i)}
          >
            Delete
          </span>
        </li>
      );
    });
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

  _addCssClasses(error, isRequired) {
    let hasError = error && error.length > 0 ? 'has-error' : '';
    let required = isRequired ? ' required' : '';
    // console.log("required:", required);
    return hasError.concat(required);
  }

  _getComponentBasedOnFieldType(
    uiFieldDef,
    layerName,
    editElemMap,
    hasMulti,
    readOrEditMode,
    objectId,
    index,
    parentIndex
  ) {
    //console.log("readOrEditMode", readOrEditMode);
    //console.log("objectId", objectId);

    const isEdit =
      this.props.editing === true || this.props.editing === undefined;
    //console.log("uiFieldDef", uiFieldDef);
    // console.log("layerName", layerName);
    let uiFieldDefKey = layerName.concat('.').concat(uiFieldDef.name);
    let uiFieldDefEntry = this.props.uiConfigDef.get(uiFieldDefKey);
    //let uiFieldDefEntry = this.props.uiConfigDef.get(uiFieldDefKey);
    if (uiFieldDefEntry != null && uiFieldDefEntry.shouldDisplay) {
      let itemClassNames,
        fieldLabelText,
        labelContent,
        fieldname,
        contentToReturn;
      /*  itemClassNames = "form-group geoFormQuestionare mandatory";
              requireField = domConstruct.create("small", {
                  className: 'requireFieldStyle',
                  innerHTML: nls.user.requiredField
              }, formContent);
          } else {
              itemClassNames = "form-group geoFormQuestionare";
          }*/

      /*if (currentField.displayType && currentField.displayType === "email") {
                           inputGroupContainer = this._addNotationIcon(formContent, "glyphicon-envelope");
                       } else if (currentField.displayType && currentField.displayType === "url") {
                           inputGroupContainer = this._addNotationIcon(formContent, "glyphicon-link");
                       }*/
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
        uiFieldDef.name.indexOf(
          this.props.appConfig.LOCATION_FIELDNAME_REGEX
        ) !== -1
      ) {
        if (this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode)) {
          //   console.log("isEditLoc", !this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode));
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
        if (objectId && readOrEditMode === this.props.appConfig.MODE_VIEW) {
          elemNameStr = uiFieldDefEntry.type
            .concat('.')
            .concat(uiFieldDefEntry.id)
            .concat('#')
            .concat(objectId);
          //defaultValToSet=this.props.data[uiFieldDefEntry.type][index][uiFieldDefEntry.id];
        } else {
          elemNameStr = uiFieldDefEntry.type
            .concat('.')
            .concat(uiFieldDefEntry.id);
          //defaultValToSet=this.props.data[uiFieldDefEntry.type][uiFieldDefEntry.id];
        }
      } else {
        elemNameStr = uiFieldDefEntry.type
          .concat('.')
          .concat(uiFieldDefEntry.id);
        //  defaultValToSet=this.props.data[uiFieldDefEntry.type][uiFieldDefEntry.id];
      }
      editElemMap.set(uiFieldDefEntry.id, elemNameStr);
      // console.log("elemNameStr", elemNameStr);
      listName = this.props.appConfig.layerIdMap.get(
        uiFieldDefEntry.type.toUpperCase()
      ).listName;
      let isRequired = this._mustPopulate(uiFieldDefEntry, readOrEditMode);
      //console.log("elemNameStr:",elemNameStr," required?", isRequired, "readOrEditMode",readOrEditMode);

      // if (currentField.displayType !== "checkbox" || currentField.domain) {
      ////!!!!!add in required start here somewhere
      labelContent = (
        <label
          className={'control-label labelTitle '.concat(
            this._addCssClasses(
              this.props.data.errorMap.get(elemNameStr, isRequired),
              isRequired
            )
          )}
          htmlFor={elemNameStr}
          title={uiFieldDefEntry.tooltip || ''}
        >
          {fieldLabelText}
        </label>
      );
      /*let contentToReturn=<div className="form-group">
             {labelContent}
             <TextInput readonly={this._notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} disabled={this._notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} itemId={uiFieldDefEntry.stateObjPathToSave} name={uiFieldDefEntry.stateObjPathToSave} inputType="number" classes={"display-text text-left"} placeholder="enter text" defaultValue={uiFieldDefEntry.stateObjPathToSave} onChange={uiFieldDefEntry.handleInputChange} editing={this.props.editing} maxlength={uiFieldDef.length} />
                 </div>;
             console.log("content to return", contentToReturn);
             return contentToReturn;
          /*return (
                 <div className="form-group">
                     {labelContent}
                     <TextInput readonly={this._notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} disabled={this._notAbleToEditItem(uiFieldDefEntry.grpsCanEdit)} itemId={uiFieldDefEntry.stateObjPathToSave} name={uiFieldDefEntry.stateObjPathToSave} inputType="number" classes={"display-text text-left"} placeholder="enter text" defaultValue={uiFieldDefEntry.stateObjPathToSave} onChange={uiFieldDefEntry.handleInputChange} editing={this.props.editing} maxlength={uiFieldDef.length} />
                 </div>);
 
             */

      switch (uiFieldDef.type) {
        case 'select':
          //  console.log("uiFieldDefEntry.domain", uiFieldDefEntry.domain);
          if (
            uiFieldDefEntry.type === 'munition' &&
            uiFieldDefEntry.id === 'ASSETAIRCRAFTCD'
          ) {
            // console.log("this.props.data.engagements[parentIndex]", this.props.data.engagements[parentIndex]);
          }
          contentToReturn = this.props.selectOptions.get(uiFieldDefEntry.domain)
            .length > 0 && (
            <div className="form-group col-md-3">
              {labelContent}
              <SelectInput
                readonly={this._notAbleToEditItem(uiFieldDefEntry)}
                disabled={this._notAbleToEditItem(uiFieldDefEntry)}
                itemId={elemNameStr}
                name={elemNameStr}
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
                editing={this._shouldDisplayEdit(
                  uiFieldDefEntry.type,
                  readOrEditMode
                )}
                handleSelectGetValue={this.props.handleSelectGetValue}
              />
              <div
                className={this._addCssClasses(
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
          //    console.log("{this.props.selectOptions.get(uiFieldDefEntry.domain)}",this.props.selectOptions.get(uiFieldDefEntry.domain));
          contentToReturn = this.props.selectOptions.get(uiFieldDefEntry.domain)
            .length > 0 && (
            <div className="form-group col-md-3">
              {labelContent}
              {this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode) ? (
                <MultiSelect
                  isMulti
                  readonly={this._notAbleToEditItem(uiFieldDefEntry)}
                  isDisabled={this._notAbleToEditItem(uiFieldDefEntry)}
                  itemId={elemNameStr}
                  name={elemNameStr}
                  value={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName,
                    false,
                    true
                  )}
                  onChange={(e) =>
                    this.props.handleInputMultiSelectChange(
                      e,
                      uiFieldDefEntry.type,
                      uiFieldDefEntry.id,
                      index,
                      hasMulti,
                      uiFieldDefEntry.idField,
                      uiFieldDefEntry.domain
                    )
                  }
                  className=" form-control"
                  classNamePrefix="form-control"
                  options={this.props.selectOptions.get(uiFieldDefEntry.domain)}
                  defaultValue={this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName,
                    false,
                    true
                  )}
                />
              ) : (
                <div className={this.props.classes + ' field-view-only'}>
                  {this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName,
                    false,
                    true
                  ) !== undefined &&
                  this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName,
                    false,
                    true
                  ) !== null &&
                  Array.isArray(
                    this._getDefaultValue(
                      hasMulti,
                      objectId,
                      index,
                      readOrEditMode,
                      uiFieldDefEntry,
                      listName,
                      false,
                      true
                    )
                  ) &&
                  this._getDefaultValue(
                    hasMulti,
                    objectId,
                    index,
                    readOrEditMode,
                    uiFieldDefEntry,
                    listName,
                    false,
                    true
                  ).length !== 0
                    ? this.props.handleMultiSelectGetValue(
                        this.props.selectOptions.get(uiFieldDefEntry.domain),
                        this._getDefaultValue(
                          hasMulti,
                          objectId,
                          index,
                          readOrEditMode,
                          uiFieldDefEntry,
                          listName,
                          false,
                          true
                        )
                      )
                    : 'No Data'}
                </div>
              )}

              <div
                className={this._addCssClasses(
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
        case 'fileInput':
          contentToReturn = (
            <div className="form-group">
              {labelContent}
              {this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode) &&
              this.props.data.attachmentsToUpload.length > 0 ? (
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
                        this._notAbleToEditItem(uiFieldDefEntry)
                      )}
                    </ul>
                  </div>
                </div>
              ) : null}
              {this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode) ? (
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
                      this._notAbleToEditItem(uiFieldDefEntry)
                    )}
                  </div>
                  <div
                    className={this._addCssClasses(
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
      /** case 'location':
          contentToReturn = (
            <div className="form-group col-md-6">
              {labelContent}
              <TextInput
                readonly={this._notAbleToEditItem(uiFieldDefEntry)}
                disabled={this._notAbleToEditItem(uiFieldDefEntry)}
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
                editing={this._shouldDisplayEdit(
                  uiFieldDefEntry.type,
                  readOrEditMode
                )}
              />
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
                    this.props.data.errorMap.get(elemNameStr, isRequired)
                  )
                )}
              >
                {labelContent}
                {isEdit ? (
                  <TextAreaInput
                    readonly={this._notAbleToEditItem(uiFieldDefEntry)}
                    disabled={this._notAbleToEditItem(uiFieldDefEntry)}
                    style={{ width: '100%' }}
                    itemId={elemNameStr}
                    name={elemNameStr}
                    classes={'display-text text-left '.concat(
                      this._addCssClasses(
                        this.props.data.errorMap.get(elemNameStr, isRequired)
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
                    editing={this._shouldDisplayEdit(
                      uiFieldDefEntry.type,
                      readOrEditMode
                    )}
                    maxlength={uiFieldDef.length}
                  />
                ) : null}
                <div
                  className={this._addCssClasses(
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
                className={'form-group col-md-3 '.concat(
                  this._addCssClasses(
                    this.props.data.errorMap.get(elemNameStr, isRequired)
                  )
                )}
              >
                {labelContent}
                <TextInput
                  readonly={this._notAbleToEditItem(uiFieldDefEntry)}
                  disabled={this._notAbleToEditItem(uiFieldDefEntry)}
                  itemId={elemNameStr}
                  name={elemNameStr}
                  inputType="text"
                  classes={'display-text text-left '.concat(
                    this._addCssClasses(
                      this.props.data.errorMap.get(elemNameStr, isRequired)
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
                  editing={this._shouldDisplayEdit(
                    uiFieldDefEntry.type,
                    readOrEditMode
                  )}
                />
                <div
                  className={this._addCssClasses(
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
              className={'form-group col-md-3 '.concat(
                this._addCssClasses(
                  this.props.data.errorMap.get(elemNameStr, isRequired)
                )
              )}
            >
              {labelContent}
              {this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode) ? (
                React.createElement('input', {
                  type: 'checkbox',
                  disabled: this._notAbleToEditItem(uiFieldDefEntry),
                  id: elemNameStr,
                  name: elemNameStr,
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
            <div className="form-group col-md-3">
              {labelContent}
              <TextInput
                readonly={this._notAbleToEditItem(uiFieldDefEntry)}
                disabled={this._notAbleToEditItem(uiFieldDefEntry)}
                itemId={elemNameStr}
                name={elemNameStr}
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
                editing={this._shouldDisplayEdit(
                  uiFieldDefEntry.type,
                  readOrEditMode
                )}
                min="0.0"
              />
              <div
                className={this._addCssClasses(
                  this.props.data.errorMap.get(elemNameStr, isRequired)
                )}
              >
                {this.props.data.errorMap.get(elemNameStr, isRequired)
                  ? this.props.data.errorMap.get(elemNameStr, isRequired)
                  : ''}
              </div>
            </div>
          );
          break;
        case 'esriFieldTypeDate':
          contentToReturn = (
            <div>
              {this._shouldDisplayEdit(uiFieldDefEntry.type, readOrEditMode) ? (
                <div className="form-group col-md-3">
                  {labelContent}
                  <DatePicker
                    readOnly={this._notAbleToEditItem(uiFieldDefEntry)}
                    disabled={this._notAbleToEditItem(uiFieldDefEntry)}
                    name={elemNameStr}
                    className="form-control"
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
                    dateFormat="YYYY-MM-DDTHH:mmZ"
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
                    minDate={
                      uiFieldDefEntry.id !== 'STRIKESTARTDTG' &&
                      this.props.data.strike.STRIKESTARTDTG !== null
                        ? moment(this.props.data.strike.STRIKESTARTDTG)
                        : null
                    }
                    // minTime={uiFieldDefEntry.id !== "STRIKESTARTDTG" && this.props.data.strike.STRIKESTARTDTG !== null? moment(this.props.data.strike.STRIKESTARTDTG): 0}
                    // maxTime={uiFieldDefEntry.id !== "STRIKEENDDTG" && this.props.data.strike.STRIKEENDDTG !== null? moment(this.props.data.strike.STRIKEENDDTG): 0}
                    maxDate={
                      uiFieldDefEntry.id !== 'STRIKEENDDTG' &&
                      this.props.data.strike.STRIKEENDDTG !== null
                        ? moment(this.props.data.strike.STRIKEENDDTG)
                        : null
                    }
                    required
                  />

                  <div
                    className={this._addCssClasses(
                      this.props.data.errorMap.get(elemNameStr, isRequired)
                    )}
                  >
                    {this.props.data.errorMap.get(elemNameStr, isRequired)
                      ? this.props.data.errorMap.get(elemNameStr, isRequired)
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
              )}
            </div>
          );
          break;
      }
      return contentToReturn;
    }
  }

  async componentWillMount() {
    console.log('in component will mount');
    // console.log("propsdata", this.props.data);
    console.log('selectOptions', this.props.selectOptions);
    //let uiConfigDefMap=JSON.parse(uiConfigDef);
    //console.log("uiConfigDefMap", uiConfigDefMap);
    //   this._renderForm();

    //moving some loads to strikeTracker---

    //await this. props._populateDomainCodes();
  }

  /**TODOOOOO---Remove from strikeForm--have copied to index.js as it can be used in another function.--------------
   * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!DOOOOO----------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   */
  _orderUIConfDef(layerName) {
    let uiDefFields = [];
    this.props.uiConfigDef.forEach((item) => {
      //  console.log("type:",item.type);
      let itemToReturn =
        item.type.toUpperCase().indexOf(layerName) !== -1 &&
        item.shouldDisplay === true;
      if (itemToReturn) {
        uiDefFields.push(item);
      }
    });
    return uiDefFields;
  }

  //    _renderForm(layerLbl, readOrEditMode, objectId, index, parentIndex) {

  _renderForm() {
    let layerLbl = this.props.layerLbl;
    let readOrEditMode = this.props.readOrEditMode;
    let objectId = this.props.objectId;
    let index = this.props.index;
    let parentIndex = this.props.parentIndex;
    console.log('in render form', this.props);
    if (this.props.data.uiFields && this.props.data.uiFields.entries) {
      //console.log("size:", this.props.data.uiFields.size == 5);
      //console.log("have uifields", this.props.data.uiFields)
      //passing this reference into Map.prototype.forEach() function so, scope available in next function
      let layerNameBase =
        this.props.appConfig.APP_SCHEMA_NAME != undefined &&
        this.props.appConfig.APP_SCHEMA_NAME.length > 0
          ? this.props.appConfig.APP_SCHEMA_NAME.concat('.')
          : '';
      let layerName;
      if (this.props.appConfig.STRIKE_TYPE === layerLbl) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(this.props.appConfig.STRIKE_TYPE)
            .layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.STRIKE_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.STRIKE_TYPE
            ).appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.STRIKE_TYPE
            ).hasMulti,
            readOrEditMode,
            objectId
          );
        }, this);
        if (
          this.props.data.editElemMap == undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(
              this.props.appConfig.STRIKE_TYPE
            ) === undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.STRIKE_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (
        this.props.appConfig.ENGAGEMENT_TYPE === layerLbl &&
        ((this.props.data.engagements &&
          this.props.data.engagements.length > 0) ||
          this._shouldDisplayEdit('engagement'))
      ) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(
            this.props.appConfig.ENGAGEMENT_TYPE
          ).layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.ENGAGEMENT_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.ENGAGEMENT_TYPE
            ).appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.ENGAGEMENT_TYPE
            ).hasMulti,
            readOrEditMode,
            objectId,
            index,
            parentIndex
          );
        }, this);
        if (
          this.props.data.editElemMap === undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(
              this.props.appConfig.ENGAGEMENT_TYPE
            ) === undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.ENGAGEMENT_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (
        this.props.appConfig.ASSET_TYPE === layerLbl &&
        this._shouldDisplayEdit(this.props.appConfig.ASSET_TYPE.toLowerCase())
      ) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(this.props.appConfig.ASSET_TYPE)
            .layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.ASSET_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(this.props.appConfig.ASSET_TYPE)
              .appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(this.props.appConfig.ASSET_TYPE)
              .hasMulti,
            readOrEditMode,
            objectId,
            index,
            parentIndex
          );
        }, this);
        if (
          this.props.data.editElemMap === undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(this.props.appConfig.ASSET_TYPE) ===
              undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.ASSET_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (
        this.props.appConfig.MUNITION_TYPE === layerLbl &&
        this._shouldDisplayEdit(
          this.props.appConfig.MUNITION_TYPE.toLowerCase()
        )
      ) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(
            this.props.appConfig.MUNITION_TYPE
          ).layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.MUNITION_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.MUNITION_TYPE
            ).appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.MUNITION_TYPE
            ).hasMulti,
            readOrEditMode,
            objectId,
            index,
            parentIndex
          );
        }, this);
        if (
          this.props.data.editElemMap === undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(
              this.props.appConfig.MUNITION_TYPE
            ) === undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.MUNITION_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (
        this.props.appConfig.ATTACHMENT_TYPE === layerLbl &&
        this._shouldDisplayEdit(
          this.props.appConfig.ATTACHMENT_TYPE.toLowerCase()
        )
      ) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(
            this.props.appConfig.ATTACHMENT_TYPE
          ).layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.ATTACHMENT_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.ATTACHMENT_TYPE
            ).appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.ATTACHMENT_TYPE
            ).hasMulti,
            readOrEditMode,
            objectId,
            index,
            parentIndex
          );
        }, this);
        /*console.log("this.props.data.editElemMap==undefined",this.props.data.editElemMap==undefined);
                console.log("this.props.data.editElemMap === null",this.props.data.editElemMap === null);
                console.log("(this.props.data.editElemMap!==null && this.props.data.editElemMap.get(this.props.appConfig.ATTACHMENT_TYPE)===null)",(this.props.data.editElemMap!==null && this.props.data.editElemMap.get(this.props.appConfig.ATTACHMENT_TYPE)===null));
                console.log("this.props.data.editElemMap.get(this.props.appConfig.ATTACHMENT_TYPE))",this.props.data.editElemMap.get(this.props.appConfig.ATTACHMENT_TYPE));

                console.log("this.props.data.editElemMap.get(this.props.appConfig.ATTACHMENT_TYPE)===null)",this.props.data.editElemMap.get(this.props.appConfig.ATTACHMENT_TYPE)===null);*/

        if (
          this.props.data.editElemMap == undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(
              this.props.appConfig.ATTACHMENT_TYPE
            ) === undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.ATTACHMENT_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (this.props.appConfig.INITIAL_BDA_TYPE === layerLbl) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(
            this.props.appConfig.INITIAL_BDA_TYPE
          ).layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.INITIAL_BDA_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        //console.log("initialbda_uifieldlist", orderedLayerUIFields);

        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.INITIAL_BDA_TYPE
            ).appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.INITIAL_BDA_TYPE
            ).hasMulti,
            readOrEditMode,
            objectId
          );
        }, this);
        if (
          this.props.data.editElemMap === undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(
              this.props.appConfig.INITIAL_BDA_TYPE
            ) === undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.INITIAL_BDA_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (this.props.appConfig.CIVCAS_TYPE === layerLbl) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(this.props.appConfig.CIVCAS_TYPE)
            .layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.CIVCAS_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.CIVCAS_TYPE
            ).appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(
              this.props.appConfig.CIVCAS_TYPE
            ).hasMulti,
            readOrEditMode,
            objectId
          );
        }, this);

        if (
          this.props.data.editElemMap === undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(
              this.props.appConfig.CIVCAS_TYPE
            ) === undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.CIVCAS_TYPE,
            editElemMap
          );
        }
        return formUI;
      } else if (
        this.props.appConfig.LINK_TYPE === layerLbl &&
        this._shouldDisplayEdit(this.props.appConfig.LINK_TYPE.toLowerCase())
      ) {
        layerName = layerNameBase.concat(
          this.props.appConfig.layerIdMap.get(this.props.appConfig.LINK_TYPE)
            .layerName
        );
        let orderedLayerUIFields = this._getOrderedFieldList(
          this._orderUIConfDef(this.props.appConfig.LINK_TYPE),
          this.props.data.uiFields.get(layerName)
        );
        let editElemMap = new Map();

        let formUI = orderedLayerUIFields.map(function (uiField) {
          //console.log("uiField", uiField);
          return this._getComponentBasedOnFieldType(
            uiField,
            this.props.appConfig.layerIdMap.get(this.props.appConfig.LINK_TYPE)
              .appConfigLayerName,
            editElemMap,
            this.props.appConfig.layerIdMap.get(this.props.appConfig.LINK_TYPE)
              .hasMulti,
            readOrEditMode,
            objectId,
            index,
            parentIndex
          );
        }, this);

        if (
          this.props.data.editElemMap == undefined ||
          this.props.data.editElemMap === null ||
          (this.props.data.editElemMap !== null &&
            this.props.data.editElemMap.get(this.props.appConfig.LINK_TYPE) ===
              undefined)
        ) {
          this.props.handleEditElemMapSet(
            this.props.appConfig.LINK_TYPE,
            editElemMap
          );
        }
        return formUI;
      }
    }
  }

  _displayErrors() {
    for (const [key, value] of this.props.data.errorMap) {
      return (
        <React.Fragment>
          <div className="has-error">{value}</div>
          <br />
        </React.Fragment>
      );
    }
  }

  render() {
    return this._renderForm();
  }
}
