const https = require("https");

const DEFAULT_PORT = 443;

const createOptions = ({ host, path, method, port = DEFAULT_PORT, headers }) => ({
    hostname: host,
    port,
    path,
    method,
    headers
});

const sendRequest = ({ host, port, method, restPath, headers = null, query = null, body = null }) => {
    const path = query ? `${restPath}?${query}` : restPath;
    const options = createOptions({ host, port, path, method, headers });

    return new Promise((resolve, reject) => {
        const successCallback = (response) => {
            let str = "";
            response.on("data", (chunk) => {
                str += chunk;
            });
            response.on("end", () => {
                resolve(str);
            });
        };

        const errorCallback = (err) => {
            console.log("problem with request: " + err);
            reject(err);
        };

        const request = https.request(options, successCallback);
        request.on("error", errorCallback);

        if (body) {
            request.write(body);
        }
        request.end();
    });
};

const _options = async ({ host, port, restPath, headers = null }) => {
    return await sendRequest({ host, port, restPath, method: "OPTIONS", headers });
};

const _head = async ({ host, port, restPath, headers = null, query = null }) => {
    return await sendRequest({ host, port, restPath, method: "HEAD", headers, query });
};

const _get = async ({ host, port, restPath, headers = null, query = null }) => {
    return await sendRequest({ host, port, restPath, method: "GET", headers, query });
};

const _post = async ({ host, port, restPath, headers = null, query = null, body = null }) => {
    return await sendRequest({ host, port, restPath, method: "POST", headers, query, body });
};

const _put = async ({ host, port, restPath, headers = null, query = null, body = null }) => {
    return await sendRequest({ host, port, restPath, method: "PUT", headers, query, body });
};

const _delete = async ({ host, port, restPath, headers = null, query = null }) => {
    return await sendRequest({ host, port, restPath, method: "DELETE", headers, query });
};


module.exports = {
    _options,
    _get,
    _head,
    _post,
    _put,
    _delete
};