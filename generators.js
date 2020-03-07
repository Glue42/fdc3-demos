/*
*  generate manifests for different platforms
*/

const openfin = require('./generators/openfin');
const web = require('./generators/web');

module.exports = {
    openfin,
    web
};