const request = require("superagent");

const _options = async ({ host, restPath, headers }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    return await request
        .options(url)
        .set(headers)
        .then((response) => response)
        .catch((error) => { throw error; });
};

const _get = async ({ host, restPath, query = null, additionalHeaders = {} }) => {
    const url = restPath ? `${host}/${restPath}` : host;
    const headers = Object.assign({}, this.headers, additionalHeaders);

    return request
        .get(url)
        .set(headers)
        .query(query)
        .then((response) => response)
        .catch((error) => { throw error; });
};

const _head = async ({ restPath, query = null, additionalHeaders = {} }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;
    const headers = Object.assign({}, this.headers, additionalHeaders);

    return request
        .head(url)
        .set(headers)
        .query(query)
        .then((response) => response)
        .catch((error) => { throw error; });
};

const _post = async ({ restPath, body = "", additionalHeaders = {} }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;
    const headers = Object.assign({}, this.headers, additionalHeaders);

    return request
        .post(url)
        .set(headers)
        .send(body)
        .then((response) => response)
        .catch((error) => { throw error; });
};

const _put = async ({ restPath, body = "", additionalHeaders = {} }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;
    const headers = Object.assign({}, this.headers, additionalHeaders);

    return request
        .put(url)
        .set(headers)
        .send(body)
        .then((response) => response)
        .catch((error) => { throw error; });
};

const _delete = ({ restPath, query = null, additionalHeaders = {} }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;
    const headers = Object.assign({}, this.headers, additionalHeaders);

    return request
        .delete(url)
        .set(headers)
        .query(query)
        .then((response) => response)
        .catch((error) => { throw error; });
};


module.exports = {
    _options,
    _get,
    _head,
    _post,
    _put,
    _delete
};