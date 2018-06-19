const https = require("https");

const DEFAULT_PORT = 443;

const ALLOWED_METHODS = [
    "OPTIONS",
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "DELETE"
];

const createOptions = ({ host, path, method, port = DEFAULT_PORT, headers }) => ({
    hostname: host,
    port,
    path,
    method,
    headers
});

const sendRequest = async ({ host, port, method, restPath, headers = null, query = null, body = null, ...passthrough }) => {
    if (!method || ALLOWED_METHODS.indexOf(method) === -1) {
        throw new Error(`Invalid HTTP method (should be one of: ${ALLOWED_METHODS.join(", ")})`);
    }

    const path = query ? `${restPath}?${query}` : restPath;
    const options = createOptions({ host, port, path, method, headers });

    const promise = new Promise((resolve, reject) => {
        const successCallback = (response) => {
            let str = "";
            response.on("data", (chunk) => {
                str += chunk;
            });
            response.on("end", () => {
                resolve({
                    response: str,
                    ...passthrough
                });
            });
        };

        const errorCallback = (error) => {
            reject({
                error,
                ...passthrough
            });
        };

        const request = https.request(options, successCallback);
        request.on("error", errorCallback);

        if (body && (method === "POST" || method === "PUT")) {
            request.write(body);
        }
        request.end();
    });

    return await promise;
};

const _options = async (params) => await sendRequest({ ...params, method: "OPTIONS" });
const _head = async (params) => await sendRequest({ ...params, method: "HEAD" });
const _get = async (params) => await sendRequest({ ...params, method: "GET" });
const _post = async (params) => await sendRequest({ ...params, method: "POST" });
const _put = async (params) => await sendRequest({ ...params, method: "PUT" });
const _delete = async (params) => await sendRequest({ ...params, method: "DELETE" });

module.exports = {
    _options,
    _get,
    _head,
    _post,
    _put,
    _delete
};