const superagent = require("superagent");

const _options = async ({ host, restPath, headers = null }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    const request = superagent.options(url);

    if (headers) {
        request.set(headers);
    }

    return await request;
};

const _head = async ({ restPath, headers = null, query = null }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;

    const request = superagent.head(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    return await request;
};

const _get = async ({ host, restPath, headers = null, query = null }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    const request = superagent.get(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    return await request;
};

const _post = async ({ restPath, headers = null, query = null, body = null }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;

    const request = superagent.post(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    if (body) {
        request.send(body);
    }

    return await request;
};

const _put = async ({ restPath, headers = null, query = null, body = null }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;

    const request = superagent.put(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    if (body) {
        request.send(body);
    }

    return await request;
};

const _delete = async ({ restPath, headers = null, query = null }) => {
    const url = restPath ? `${this.hostUrl}/${restPath}` : this.hostUrl;

    const request = superagent.delete(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    return await request;
};


module.exports = {
    _options,
    _get,
    _head,
    _post,
    _put,
    _delete
};