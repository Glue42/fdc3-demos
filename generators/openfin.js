const config = require('../config');

 /**
  * generate the openfin manifest from metadata in the demos.json datastructure
  * @param {*} data  
  * @param {*} request 
  */
const generate = (data, request) => {
    const result = {};
    const startup_app = {};
    const fullhost = request.hostname === "localhost" ? request.hostname + ":" + config.port : request.hostname;
    let subdomains = "";
    request.subdomains.forEach(sub => {
        const dot = (subdomains.length > 0) ? "." : "";
        subdomains = `${subdomains}${dot}${sub}`;
    });
    //add a trailing dot
    subdomains = subdomains.length > 0 ? `${subdomains}.` : subdomains;

    startup_app.name = data.name;
    startup_app.uuid = data.name;
    startup_app.url = `${request.protocol}://${subdomains}${fullhost}/${data.name}.html`;
    startup_app.autoShow = true;
    startup_app.saveWindowState = true;
    startup_app.frame = true;
  
    startup_app.preloadScripts = [
        {
            "url": "https://cdn.openfin.co/services/openfin/fdc3/0.2.0/openfin-fdc3.js"
        }
    ];
   
   
    result.startup_app = startup_app;

    result.runtime = {
        "version":"stable"
    };
    result.services = [
        {
            "name": "fdc3"
        }
    ];
    result.shortcut = {};

    return result;
};



module.exports = {
    generate
}