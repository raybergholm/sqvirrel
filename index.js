const { Sqvirrel, ADAPTER_METHODS } = require("./lib/Sqvirrel");

const basicAuth = require("./lib/utils/basicAuth");
const utils = {
    ...basicAuth
};

module.exports = {
    Sqvirrel,
    ADAPTER_METHODS,
    utils
};