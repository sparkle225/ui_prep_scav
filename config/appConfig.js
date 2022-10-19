let appConfig={
  "APP_GROUPS":[{"groupName":"Scavenger – Admin","groupID":"6fb6b7299cd04d9eaa7ab41e51075959"},{"groupName":"DataCollector – OpsAdmin", "groupID":"f955176dd7c44981ac8751a5aa4452d3"},
  {"groupName":"Scavenger – Viewer","groupID":"a4efcccf0318497f8133707971641d05"}],
  "APP_HOSTNAME": "http://localhost",
  "APP_PORT": 3010,
  "APP_BASE_PAGE_URL": "/scavenger",
  "APP_VIEW_ITEM_URL": "/scavenger/view?itemid=",
  "APP_DASHBOARD_URL": "https://somewhere.nice",
  "APP_LOGO_PATH": "../../images/scavenger.png",
  "APP_CONFIG_UPDATE_ABSOLUTE_URL": "http://localhost:8010/Scavenger/api/resource/updateConfig",
  "DISPLAYFIELDCONFIG_LOC":"/static/config/displayFieldConfig.json",
  "layerIdMap": {
      "DATAITEM": {
          "layerName": "DATAITEM",
          "appConfigLayerName": "DATAITEM",
          "geoLat": "LOC_LATITUDE",
          "geoLon": "LOC_LONGITUDE",
          "layerId": 0,
          "disableFieldsToShow": [
              "CREATEDAT",
              "UPDATEDAT"
          ],
          "dateFieldsToFormat": [
              "CREATEDAT",
              "UPDATEDAT"
          ],
          "textAreaFields": []
          ,
          "multiSelectFields": [],
          "booleanFields": [],
          "hasMulti": false,
          "listName": null,
          "columns": [
              {
                  "dataField": "OBJECTID",
                  "text": "objectID",
                  "hidden": true
              },
              {
                  "dataField": "COCOMTYPECD",
                  "text": "Cocom Type",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"COCOMTYPECD"
                  }
              },
              {
                  "dataField": "MISSIONDTG",
                  "text": "Mission Date",
                  "sort": true,
                  "headerClassEdit":"requiredTableHeader",
                  "filter": "dateFilter",
                  "classes": "tablePrintTD",
                  "formatter": "DATE_FORMATTER",
                  "csvFormatter": "DATE_FORMATTER",
                  "formatExtraData":{
                      "name":"MISSIONDTG",
                      "formatter":"DATE_FORMATTER"
                  }
              },
              {
                  "dataField": "MISSIONTYPE",
                  "text": "Mission Type",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"MISSIONTYPE"
                  }
              },
              {
                  "dataField": "ASSETAIRCRAFTCD",
                  "text": "Asset Type",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"ASSETAIRCRAFTCD"
                  }
              },
              {
                  "dataField": "CALLSIGNDESIGNATOR",
                  "text": "Callsign Designator",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"CALLSIGNDESIGNATOR"
                  }
              },
              {
                  "dataField": "OPERATIONTYPECD",
                  "text": "Operation Type",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"OPERATIONTYPECD"
                  }
              },
              {
                  "dataField": "OPNAMETYPECD",
                  "text": "OpName Type",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"OPNAMETYPECD"
                  }
              },
              {
                  "dataField": "TASKINGTYPE",
                  "text": "Tasking Type",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"TASKINGTYPE"
                  }
              },
              {
                  "dataField": "ONSTATIONDTG",
                  "text": "OnStation Date",
                  "sort": true,
                  "headerClassEdit":"requiredTableHeader",
                  "filter": "dateFilter",
                  "classes": "tablePrintTD",
                  "formatter": "DATE_FORMATTER",
                  "csvFormatter": "DATE_FORMATTER",
                  "formatExtraData":{
                      "name":"ONSTATIONDTG",
                      "formatter":"DATE_FORMATTER"
                  }
              },
              {
                  "dataField": "OFFSTATIONDTG",
                  "text": "OffStation Date",
                  "sort": true,
                  "headerClassEdit":"requiredTableHeader",
                  "filter": "dateFilter",
                  "classes": "tablePrintTD",
                  "formatter": "DATE_FORMATTER",
                  "csvFormatter": "DATE_FORMATTER",
                  "formatExtraData":{
                      "name":"OFFSTATIONDTG",
                      "formatter":"DATE_FORMATTER"
                  }
              },  
              {
                  "dataField": "HC",
                  "text": "HC",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"HC"
                  }
              },
              {
                  "dataField": "PG",
                  "text": "PG",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"PG"
                  }
              },
              {
                  "dataField": "PG",
                  "text": "PG",
                  "headerClassEdit":"requiredTableHeader",
                  "sort": true,
                  "formatExtraData":{
                      "name":"PG"
                  }
              },
              {
                  "dataField": "SA",
                  "text": "SA",
                  "sort": true,
                  "filter": "numberFilter",
                  "formatExtraData":{
                      "name":"SA"
                  }
              },
              {
                  "dataField": "GA",
                  "text": "GA",
                  "sort": true,
                  "filter": "numberFilter",
                  "formatExtraData":{
                      "name":"GA"
                  }
              },
              {
                  "dataField": "PTT",
                  "text": "PTT",
                  "sort": true,
                  "formatExtraData":{
                      "name":"PTT"
                  }
              },
              {
                  "dataField": "EEIs_OBSERVED",
                  "text": "EEIs OBSERVED",
                  "sort": true,
                  "formatExtraData":{
                      "name":"EEIs_OBSERVED"
                  }
              },
              {
                  "dataField": "TOTALONSTATION",
                  "text": "Total OnStation Time",
                  "sort": true,
                  "formatExtraData":{
                      "name":"TOTALONSTATION"
                  }
              },
              {
                  "dataField": "ISSUEREASONTYPECD",
                  "text": "Issue Reason Type",
                  "sort": true,
                  "formatExtraData":{
                      "name":"ISSUEREASONTYPECD"
                  }
              },
              {
                  "dataField": "ISSUEDESCRIPTION",
                  "text": "Issue Description",
                  "sort": true,
                  "formatExtraData":{
                      "name":"ISSUEDESCRIPTION"
                  }
              },
              {
                  "dataField": "MISSIONNOTES",
                  "text": "Mission Notes",
                  "sort": true,
                  "formatExtraData":{
                      "name":"MISSIONNOTES"
                  }
              },
            
              {
                  "dataField": "actions",
                  "text": "Actions",
                  "isDummyField": true,
                  "formatter": "ACTIONS_FORMATTER",
                  "csvExport": false,
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "formatExtraData":{
                      "formatter":"ACTIONS_FORMATTER"
                  }
                  
              }
          ]
      },
      "SCAVENGER_AUDIT": {
          "layerName": "SCAVENGER_AUDIT",
          "appConfigLayerName": "SCAVENGER_AUDIT",
          "layerId": 1,
          "disableFieldsToShow": [
              "CREATEDAT",
              "UPDATEDAT",
              "INITIATEDAT"
          ],
          "dateFieldsToFormat": [
              "CREATEDAT",
              "UPDATEDAT",
              "INITIATEDAT"
          ],
          "textAreaFields": ["DESCRIPTION"],
          "multiSelectFields": [],
          "booleanFields": [],
          "hasMulti": false,
          "listName": null,
          "columns": [
              {
                  "dataField": "OBJECTID",
                  "text": "objectID",
                  "hidden": true
              },
              {
                  "dataField": "ENTITYTYPE",
                  "text": "Event Type",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BOTH"
              },
              {
                  "dataField": "EVENT_RESULT_STATE",
                  "text": "Event Result State",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BOTH"                
              },
              {
                  "dataField": "EVENT_RESULT_SUMMARY",
                  "text": "Event Result Summary",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
              },
              {
                  "dataField": "DATAID",
                  "text": "BaseItem Id",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
              },
              {
                  "dataField": "TARGETOBJID",
                  "text": "Target Object Id",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
              },
              {
                  "dataField": "PREVIOUS_VALUE",
                  "text": "Previous Value",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
              },
              {
                  "dataField": "NEW_VALUE",
                  "text": "New Value",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
                  
              },
              {
                  "dataField": "REST_REQUEST_URL",
                  "text": "Rest Request Url",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_ADV"
              },
              {
                  "dataField": "REST_REQUEST_BODY",
                  "text": "Rest Request Body",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_ADV"
              },
             
              {
                  "dataField": "INITIATEDAT",
                  "text": "Initiated At",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BOTH"
              },
              {
                  "dataField": "INITIATORTYPE",
                  "text": "Initiator Type",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
              },
              {
                  "dataField": "INITIATEDBY",
                  "text": "Initiated By",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_BASIC"
              },
              {
                  "dataField": "ERROR_EVENT_INFO ",
                  "text": "Error Information",
                  "sort": true,
                  "classes": "tablePrintTD",
                  "headerStyle":"HEADER_WIDTH_STYLE_FORMATTER",
                  "hidden": "DETERMINE_SHOULD_SHOW_ADV"
              }
          ]
             
      }
  }
};

export default appConfig;
