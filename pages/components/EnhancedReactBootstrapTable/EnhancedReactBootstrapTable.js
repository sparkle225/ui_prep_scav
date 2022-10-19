import moment from "moment";
import React, { useState, useEffect } from 'react';

import { Button, ButtonToolbar } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, dateFilter, selectFilter, numberFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import editFactory, { Type } from 'react-bootstrap-table2-editor';
import "react-datepicker/dist/react-datepicker.css";
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import styles from "./EnhancedReactBootstrapTable.module.css";
import ErrorBoundary from '../foundational/ErrorBoundary.js';
import RenderFormComponent from '../foundational/RenderFormComponent.js';
import WithRenderFormComponent from '../foundational/WithRenderFormComponent.js';

const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

let ViewWithRenderFormComponentForTable = WithRenderFormComponent(RenderFormComponent);


function EnhancedReactBootstrapTable(props) {

    const [addEditRowIndex, setAddEditRowIndex] = useState();
    const [editElemMap, setEditElemMap] = useState(new Map())
    /*console.log("map in render-StrikeTable-tableData", props.tableData);
    console.log("map in render-StrikeTable-columnDef", props.columnDef);
    console.log("map in render-StrikeTable-canEditType", props.canEditType);*/

    useEffect(() => {
        if (props.layerType != undefined && editElemMap.get(props.layerType) != undefined && props.props.columnDef.slice(0) != undefined && editElemMap.get(props.layerType).length == props.props.columnDef.slice(0).length) {
            props.handleEditElemMapSet(props.layerType, props.editElemMap);
        }
    }, [editElemMap])


    const renderButtons = (cell, row, rowIndex) => {
        console.log("Btnrow", row);
        console.log("props.canShowAdd", props.canShowAdd);
        console.log("props.edit", props.edit)
        let keyidField = props.appConfig.KEYIDFIELD;
        var parentid = props.parentFieldId != null ? row[props.parentFieldId] : "";
        return (

            <ErrorBoundary appConfig={props.appConfig}>
                <ButtonToolbar className="btnToolBar">
                    {props.canShowAdd == true && props.edit == true && (row[keyidField] == props.idEditing || ((props.idEditing == undefined || props.idEditing == null) && row[keyidField] == -1)) ? (
                        <React.Fragment>
                            <Button className="btn-sm btn-success"
                                onClick={() => {
                                    console.log("Table save/create"); props.submitData(props.layerType, props.data[props.layerType.toLowerCase()], props.linkObjType, parentid);
                                }}
                            >
                                {"Submit"}

                            </Button>
                            <Button className="btn-sm"
                                onClick={() => {
                                    console.log("Table cancel"); props.handleEdit(null, row[keyidField], props.layerType.toLowerCase(), null, rowIndex);
                                }}
                            >
                                {"Cancel"}
                            </Button></React.Fragment>)

                        : (props.viewUrl != undefined && (props.canShowAdd == undefined || props.canShowAdd == true)) ? (
                            <Button className="btn-sm btn-success"
                                onClick={() => {
                                    console.log("View save/create"); redirectToUrl(props.handleViewRequest(props.viewUrl, row[keyidField]));
                                }}
                                disabled={props.edit}
                            >
                                <span className="fa fa-file-pdf-o" />
                            </Button>) : null}

                    {props.notShowEdit == undefined && ((props.canEditType && props.canShowAdd == undefined) || (props.canShowAdd == true && !props.edit)) ? (
                        <Button className="btn-sm"
                            onClick={() => {
                                if (props.editUrl != undefined) {
                                    redirectToUrl(props.handleEditRequest(props.editUrl, row[keyidField]));
                                } else {
                                    props.handleEdit(row.type, row[keyidField], null, row, rowIndex);
                                    editRow(cell, row, rowIndex);
                                }
                            }}
                            disabled={props.edit}
                        >
                            <span className="fa fa-pencil" />
                        </Button>) : null}

                      {(row.downloadUrl!=undefined && row.downloadUrl!=null) &&(props.canShowAdd == undefined || (props.canShowAdd == true && !props.edit)) && (props.isOpsAdmin || (props.canEditType && props.deleteOnlyOpsAdmin == undefined)) ?
                        <Button className="btn-sm"
                            href={row.downloadUrl} target="#"
                            disabled={props.edit}
                        >
                            <span className="fa fa-download" />
                        </Button>
                        : null}
                    {(props.canShowAdd == undefined || (props.canShowAdd == true && !props.edit)) && (props.isOpsAdmin || (props.canEditType && props.deleteOnlyOpsAdmin == undefined)) ?
                        <Button className="btn-sm"
                            onClick={() => {
                                var parentid = props.parentFieldId != null ? row[props.parentFieldId] : "";
                                props.deleteItem(row.type, row[keyidField], parentid != undefined ? parentid : undefined, props.updateStateAfterDel)
                            }}
                            disabled={props.edit}
                        >
                            <span className="fa fa-trash" />
                        </Button> : null}
                </ButtonToolbar></ErrorBoundary>
        );
    }

    const renderDefaultView = (cell, row) => {
        return cell;
    };


    const renderBooleans = (cell, row) => {
        if (cell === 1) {
            return true;
        } else {
            return false;
        }
    };

    const renderDate = (cell, row) => {
        if (cell != undefined && cell !== null && cell !== "") {
            let date;
            if (props.dateFormat != undefined) {
                date = moment(cell).format(props.dateFormat);
            } else {
                date = moment(cell).format();
            }
            return date;
        } else {
            return "";
        }
    };

    const renderLocationInfo = (cell, row) => {
        if (props.renderLocationInfo != undefined) {
            return props.renderLocationInfo(cell, row);
        } else {
            return "";
        }
    }


    const renderCustomComp = (cell, row) => {
        //  console.log("rowwithinRenderCustomComp:",row)
        return (
            <ErrorBoundary appConfig={props.appConfig}>
                {row.CUSTOMCOMP}
            </ErrorBoundary>
        )
    }

    const validateJson = (newValue, cell, row) => {
        let validationResponse = props.validateJson(newValue, cell.type);
        if (validationResponse !== undefined) {
            let failedValidation = {
                valid: false,
                message: validationResponse
            }
            return failedValidation;
        }
        return true;
    }

    const setTypeBasedOnCell = (cell, row) => {
        if (cell.type === "object" || cell.type === "array") {
            return "string"
        } else {
            return cell.type;
        }
    }

    const setEditorBasedOnCellType = (cell, row) => {
        let editor = { type: Type.TEXTAREA };
        if (row["value"].length > 50) {
            editor = { type: Type.TEXTAREA };
        }
        return editor;
    }

    const setEditCSSBasedOnCellType = (cell, row) => {
        let cssClass = "configText";
        if (row["value"].length > 50) {
            cssClass = "configTextArea";
        }
        return cssClass;
    }

    const cssBasedOnValueLength = (cell, row, rowIndex, colIndex) => {
        console.log("cell", cell);
    }

    const _getSorted = (defaultSorted) => {
        if (props.defaultSortedDef) {
            return props.defaultSortedDef;
        } else {
            return defaultSorted;
        }
    }

    const headerFilterFormatter = (column, colIndex, { sortElement, filterElement }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>
                    {column.text}  {sortElement}
                </span>
                {filterElement}
            </div>
        );
    }



    const _fixColumns = (type) => {
        let columnDefinitions = props.columnDef.slice(0);
        if (columnDefinitions && columnDefinitions.length > 0) {
            columnDefinitions.map((col, index) => {
                if (col.formatter && col.formatter == "BOOLEAN_FORMATTER") {
                    col.formatter = renderCell
                    col.csvFormatter = renderBooleans;
                } else if (col.formatter && col.formatter === "LOCATION_FORMATTER") {
                    col.formatter = renderCell;
                    col.csvFormatter = renderLocationInfo;
                } else if (col.formatter && col.formatter === "DATE_FORMATTER") {
                    col.formatter = renderCell;
                    col.csvFormatter = renderDate;
                } else {
                    col.formatter = renderCell;
                }

                if (col.filter && col.filter === "textFilter") {
                    col.filter = textFilter();
                } else if (col.filter && col.filter === "dateFilter") {
                    col.filter = dateFilter();
                } else if (col.filter && col.filter === "numberFilter") {
                    col.filter = numberFilter();
                }

                if (col.headerFormatter && col.headerFormatter === "HEADER_FILTER_FORMATTER") {
                    col.headerFormatter = headerFilterFormatter();
                }

                if (col.validator && col.validator === "JSON_VALIDATOR") {
                    col.validator = validateJson;
                }

                if (col.editor && col.editor === "CONFIG_EDITOR_TYPE") {
                    col.editor = { type: Type.TEXTAREA };
                }

                if (col.editCellClasses && col.editCellClasses === "CONFIG_EDITCSS_TYPE") {
                    col.editCellClasses = setEditCSSBasedOnCellType;
                }
                if (col.headerStyle && col.headerStyle === "HEADER_WIDTH_STYLE_FORMATTER") {
                    if (props.isOpsAdmin && props.isAdvAuditView || col.dataField === "actions" || col.dataField === "CUSTOMCOMP" || (col.formatter && col.formatter === "DATE_FORMATTER")) {
                        // console.log("should be setting width in 11%", " ",props.isOpsAdmin, " ",props.isAdvAuditView)
                        col.headerStyle = { width: "11%", "fontSize": "13px" };
                    } else {
                        col.headerStyle = { width: "9%", "fontSize": "13px" };
                    }
                }
                if (props.edit === true && col.headerClassEdit != undefined) {
                    if (col.headerClasses != undefined && col.headerClasses != null && col.headerClasses.length > 0 && col.headerClasses.includes(col.headerClassEdit) == false) {
                        col.headerClasses = headerClasses.concat(' ').concat(col.headerClassEdit);
                    } else {
                        col.headerClasses = col.headerClassEdit
                    }
                } else {
                    if (col.headerClasses != undefined && col.headerClasses != null && col.headerClasses.length > 0 && col.headerClasses.includes(col.headerClassEdit) == true) {
                        col.headerClasses = col.headerClasses.replace(col.headerClassEdit, '');
                    }
                }

                if (col.hidden !== undefined && typeof (col.hidden) === 'string' && col.hidden.indexOf("DETERMINE_SHOULD_SHOW") !== -1) {
                    //  console.log("col.dataField",col.dataField," col.hidden:",col.hidden);
                    if (props.isAdvAuditView == true && col.hidden === "DETERMINE_SHOULD_SHOW_ADV" || (props.isAdvAuditView == false && col.hidden === "DETERMINE_SHOULD_SHOW_BASIC")) {
                        col.hidden = false;
                    } else if (props.isAdvAuditView == false && col.hidden === "DETERMINE_SHOULD_SHOW_BASIC" || (props.isAdvAuditView == false && col.hidden === "DETERMINE_SHOULD_SHOW_ADV")) {
                        col.hidden = true;
                    }

                    if (col.hidden != undefined && col.hidden === "DETERMINE_SHOULD_SHOW_BOTH") {
                        col.hidden = false;
                    }
                } else if (col.hidden !== undefined && typeof (col.hidden) === 'string' && col.hidden === 'props.displayPDF') {
                    col.hidden = props.displayPDF;
                }

                // console.log("props.displayPDF===true",props.displayPDF);
                if ((type !== undefined && !col.hidden || !col.hidden === true) && (type.toLowerCase() === "attachment" || type.toLowerCase() === "munition" || type.toLowerCase() === "asset") && (props.displayPDF !== undefined && props.displayPDF === true)) {
                    //   console.log("inside hidden check")
                    col.hidden = props.shouldShowCol(props.tableData, col.dataField);
                }



            });
        }
        return columnDefinitions;
    }



    const redirectToUrl = (urlToRedirect) => {
        window.location.assign(urlToRedirect);
    }

    const handleColumnConfig = () => {
        if (props.handleColumnConfig != undefined) {
            return props.handleColumnConfig();
        } else {
            return _fixColumns(props.typeDisplaying)
        }
    }

    const renderComponentForCell = (cell, row, rowIndex, objectId, parentIndex, formatExtraData) => {
        let layerNameBase = props.appConfig.APP_SCHEMA_NAME != undefined && props.appConfig.APP_SCHEMA_NAME.length > 0 ? props.appConfig.APP_SCHEMA_NAME.concat(".") : "";
        let layerName = layerNameBase.concat(props.appConfig.layerIdMap.get(props.layerType).layerName);
        let uiField = props.uiFieldLoader(formatExtraData.name, layerName);
        if (uiField != undefined) {
            let idInfo = {};
            idInfo.parentIndex = parentIndex;
            idInfo.index = rowIndex;
            idInfo.objectId = objectId != -1 ? objectId : undefined;
            idInfo.layerName = props.appConfig.layerIdMap.get(props.layerType).layerName;

            //  console.log(" extraCss={props.extraCss?props.extraCss:undefined}", props.extraCss?props.extraCss:undefined);
            let compToReturn = (
                <ErrorBoundary appConfig={props.appConfig}>
                    <ViewWithRenderFormComponentForTable idInfo={idInfo} uiField={uiField} editElemMap={editElemMap} hasMulti={props.appConfig.layerIdMap.get(props.layerType).hasMulti}
                        readOrEditMode={props.edit ? props.appConfig.MODE_EDIT : props.appConfig.MODE_VIEW} mustPopulate={props.mustPopulate} layerName={idInfo.layerName} {...props} hideLabel={true}
                        extraCss={props.extraCss ? props.extraCss : undefined} />
                </ErrorBoundary>
            )
            // props.handleEditElemMapSet(props.layerType, props.editElemMap);
            return compToReturn;
        } else {
            return (
                <ErrorBoundary appConfig={props.appConfig}>
                    <p>Unable to complete requested operation.</p>
                </ErrorBoundary>);
        }

    }

    const renderCell = (cell, row, rowIndex, formatExtraData) => {
        // console.log("row:", row, "cell:", cell, "rowIndex:", rowIndex, "formatExtraData:", formatExtraData);
        if (props.edit && addEditRowIndex == rowIndex && (formatExtraData != undefined && formatExtraData.name != undefined)) {
            //   console.log("need to return a function to return a custom component for data entry");
            return renderComponentForCell(cell, row, rowIndex, row[props.appConfig.KEYIDFIELD], row[props.parentFieldId], formatExtraData)
        } else if (formatExtraData != undefined && formatExtraData.formatter != undefined && formatExtraData.formatter === "DATE_FORMATTER") {
            return renderDate(cell, row);
        } else if (formatExtraData != undefined && formatExtraData.formatter != undefined && formatExtraData.formatter === "CUSTOMCOMPONENT_FORMATTER") {
            return renderCustomComp(cell, row);
        } else if (formatExtraData != undefined && formatExtraData.formatter != undefined && formatExtraData.formatter === "BOOLEAN_FORMATTER") {
            return renderBooleans(cell, row);
        } else if (formatExtraData != undefined && formatExtraData.formatter != undefined && formatExtraData.formatter === "LOCATION_FORMATTER") {
            return renderLocationInfo(cell, row);
        } else if (formatExtraData != undefined && formatExtraData.formatter != undefined && (formatExtraData.formatter === "PICK_ACTIONS_FORMATTER" || formatExtraData.formatter === "ACTIONS_FORMATTER")) {
            return renderButtons(cell, row, rowIndex);
        } else {
            return renderDefaultView(cell, row);
        }
    }


    const addNewRow = (cell, row, rowIndex) => {
        // console.log("here is where I call to renderWithComponent based on columns", props.tableData.length + 1);
        //   console.log("type", props.typeDisplaying);
        // props.handleEdit(row.type, row[keyidField], null,row);
        //would need to add empty values for all visable fields
        setAddEditRowIndex(props.tableData.length - 1);
        //, row[keyidField], null,row);
    }

    const editRow = (cell, row, rowIndex) => {
        //   console.log("here is where I call to renderWithComponent based on columns", props.tableData.length + 1);
        //    console.log("type", props.typeDisplaying);
        // props.handleEdit(row.type, row[keyidField], null,row);
        //would need to add empty values for all visable fields
        setAddEditRowIndex(rowIndex);
        //, row[keyidField], null,row);
    }

    {/* console.log("map in render-StrikeTable-tableData", props.tableData) }
    console.log("map in render-StrikeTable-columnDef", props.columnDef);
    console.log("map in render-StrikeTable-canEditType", props.canEditType);
    console.log("map in render-StrikeTable-cssExtra", props.extraCss);*/
        if (props.tableData != undefined && props.columnDef != undefined) {

            return (
                <div className="form-inline">
                    {(props.typeDisplaying == "strike") && props.canEditType ?
                        <div className="col-sm-12">
                            <ButtonToolbar className="btnToolBar">
                                <Button className="btn-sm btn-success"
                                    onClick={() => {
                                        console.log("View save/create"); redirectToUrl(props.createUrl);
                                    }}
                                >
                                    Create New
            </Button>
                                <br />
                            </ButtonToolbar>
                        </div>
                        : null}
                    <div>
                        {props.isExport || props.showSearch && !props.displayPDF ?

                            <ToolkitProvider
                                keyField={props.keyField}
                                data={props.tableData}
                                columns={handleColumnConfig()}
                                exportCSV
                                search={{
                                    searchFormatted: true,
                                    className: 'search'
                                }}>
                                {
                                    props => (

                                        <div>
                                            {props.canEditType ?
                                                <ExportCSVButton {...props.csvProps}>Export CSV</ExportCSVButton> : null}
                                            {props.showSearch ?
                                                <div className="searchInput btnToolBar"><SearchBar {...props.searchProps} /><ClearSearchButton {...props.searchProps}></ClearSearchButton></div> : null}
                                            {console.log("props.canEditType:", props.canEditType, "!props.edit:", !props.edit, "props.canShowAdd!=undefined:", props.canShowAdd != undefined)}
                                            {props.canEditType && !props.edit && props.canShowAdd != undefined ?
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <ButtonToolbar className="btnToolBar">
                                                            <Button className="btn-sm btn-success"
                                                                onClick={() => {
                                                                    console.log("Engagement save/create");
                                                                    props.handleAddItem(props.layerType.toLowerCase()); addNewRow();
                                                                }}
                                                                aria-controls="example-collapse-text"
                                                            >
                                                                {"Add"}
                                                            </Button>
                                                        </ButtonToolbar>
                                                    </div></div>
                                                : null
                                            }

                                            {/* <hr/> */}
                                            <BootstrapTable
                                                {...props.baseProps}
                                                noDataIndication="Table Is Empty"

                                                pagination={paginationFactory({
                                                    showTotal: true
                                                })}
                                                defaultSorted={_getSorted()}
                                                cellEdit={props.shouldEdit ? editFactory({ mode: 'dbclick', timeToCloseMessage: 5000 }) : undefined}
                                                filter={filterFactory()}
                                                striped
                                                condensed
                                                hover

                                            />

                                        </div>)
                                }

                            </ToolkitProvider>


                            : props.displayPDF ?
                                <BootstrapTable
                                    keyField="OBJECTID"
                                    id={props.id}
                                    data={props.tableData}
                                    columns={_fixColumns(props.typeDisplaying)}
                                    noDataIndication="Table Is Empty"

                                    defaultSorted={_getSorted()}
                                    striped
                                    condensed
                                    hover
                                />
                                : <React.Fragment>
                                    {console.log("props.canEditType:", props.canEditType, "!props.edit:", !props.edit, "props.canShowAdd!=undefined:", props.canShowAdd != undefined)}
                                    {props.canEditType && !props.edit && props.canShowAdd != undefined ?
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <ButtonToolbar className="btnToolBar">
                                                    <Button className="btn-sm btn-success"
                                                        onClick={() => {
                                                            console.log("Engagement save/create"); props.handleAddItem(props.layerType.toLowerCase()); addNewRow();
                                                        }}
                                                        aria-controls="example-collapse-text"
                                                    >
                                                        {"Add"}
                                                    </Button>
                                                </ButtonToolbar>
                                            </div></div>
                                        : null
                                    }
                                    <BootstrapTable
                                        keyField="OBJECTID"
                                        data={props.tableData}
                                        columns={handleColumnConfig()}
                                        noDataIndication="Table Is Empty"
                                        pagination={paginationFactory({
                                            showTotal: true
                                        })}
                                        defaultSorted={_getSorted()}
                                        cellEdit={props.shouldEdit ? editFactory({ mode: 'dbclick', timeToCloseMessage: 5000 }) : undefined}
                                        filter={filterFactory()}
                                        striped
                                        condensed
                                        hover
                                    />
                                </React.Fragment>
                        }
                    </div>
                </div>
            )
        } else {
            console.log("for some reason data state is null-StrikeTable");
            return null;
        }
    }
}


export default EnhancedReactBootstrapTable;
