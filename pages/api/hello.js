// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import appConfig from "../../config/appConfig";

export default (req, res) => {
  // Open Chrome DevTools to step through the debugger!
  // debugger;
  res.status(200).json({ name: 'Hello, world!' });
};


function _loadAppConfig() {
  fetch(./../../config/appConfig.json").then(response => response.json()).then(results => {
    //  console.log("config-String", results);
    let parsedLayerIdMap = this._objToStrMap(appConfig.layerIdMap);
    let appConfigCopy = $.extend({}, (appConfig));
    console.log("parsedLayerIdMap", parsedLayerIdMap);
    appConfigCopy.layerIdMap = parsedLayerIdMap;
    resolve(appConfigCopy)
   }).catch(err => console.error("Error occurred getting data", err));
});

