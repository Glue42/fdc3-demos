/*
{
    "name": "FDC3 TradingView Chart",
    "start_url": "https://appd.kolbito.com/demos/tradingview-chart/index.html",
    "short_name": "TV-Chart",
    "display":"standalone",
    "scope": "/",
    "background_color": "#222",
    "theme_color":"#222",
    "icons": [
        {
            "src": "https://appd.kolbito.com/images/fdc3-icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "https://appd.kolbito.com/images/fdc3-icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}*/

const config = require('../config');

/**
  * generate the web app manifest from metadata in the demos.json datastructure
  * @param {*} data
  * @param {*} request
  */
const generate = (data, request) => {
    const result = {};
    const fullhost = request.hostname === "localhost" ? request.hostname + ":" + config.port : request.hostname;
    let subdomains = "";
    request.subdomains.forEach(sub => {
        const dot = (subdomains.length > 0) ? "." : "";
        subdomains = `${subdomains}${dot}${sub}`;
    });
    //add a trailing dot
    subdomains = subdomains.length > 0 ? `${subdomains}.` : subdomains;

    result.name = data.title ? data.title : data.name;
    result.start_url = `${request.protocol}://${subdomains}${fullhost}/${data.name}`;
    result.short_name = data.name;
    result.display = "standalone";
    result.scope = "/";
    result.icons = [];

    return result;
};

module.exports = {
    generate
};
