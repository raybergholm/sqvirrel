const superagent = require("superagent");

const _options = async ({ host, restPath, headers = null, ...passthrough }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    const request = superagent.options(url);

    if (headers) {
        request.set(headers);
    }

    const response = await request;
    return {
        response,
        ...passthrough
    };
};

const _head = async ({ host, restPath, headers = null, query = null, ...passthrough }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    const request = superagent.head(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    const response = await request;
    return {
        response,
        ...passthrough
    };
};

const _get = async ({ host, restPath, headers = null, query = null, ...passthrough }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    const request = superagent.get(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    const response = await request;
    return {
        response,
        ...passthrough
    };
};

const _post = async ({ host, restPath, headers = null, query = null, body = null, ...passthrough }) => {
    const url = restPath ? `${host}/${restPath}` : host;

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

    const response = await request;
    return {
        response,
        ...passthrough
    };
};

const _put = async ({ host, restPath, headers = null, query = null, body = null, ...passthrough }) => {
    const url = restPath ? `${host}/${restPath}` : host;

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

    const response = await request;
    return {
        response,
        ...passthrough
    };
};

const _delete = async ({ host, restPath, headers = null, query = null, ...passthrough }) => {
    const url = restPath ? `${host}/${restPath}` : host;

    const request = superagent.delete(url);

    if (headers) {
        request.set(headers);
    }

    if (query) {
        request.query(query);
    }

    const response = await request;
    return {
        response,
        ...passthrough
    };
};


module.exports = {
    _options,
    _get,
    _head,
    _post,
    _put,
    _delete
};