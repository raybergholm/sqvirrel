
const sendRequest = ({ host, port, method, restPath, headers = null, query = null, body = null }) => {
    const path = query ? `${restPath}?${query}` : restPath;
    const fullUrl = query ? `${host}/${path}` : host;

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open(method, fullUrl);

        if (headers) {
            Object.keys(headers).forEach((key) => request.setRequestHeader(key, headers[key]));
        }

        request.onload = () => {
            if ([200, 202, 204].indexOf(request.status) > -1) {
                resolve(request.response);
            } else {
                reject();
            }
        };

        if (body) {
            request.send(JSON.stringify(body));
        } else {
            request.send(); // TODO: superfluous?
        }
    });
};

const _options = async ({ host, port, restPath, headers = null }) => {
    // Implement your OPTIONS handler here
};

const _head = async ({ host, port, restPath, headers = null, query = null }) => {
    // Implement your HEAD handler here
};

const _get = async ({ host, port, restPath, headers = null, query = null }) => {
    // Implement your GET handler here
};

const _post = async ({ host, port, restPath, headers = null, query = null, body = null }) => {
    // Implement your POST handler here
};

const _put = async ({ host, port, restPath, headers = null, query = null, body = null }) => {
    // Implement your PUT handler here
};

const _delete = async ({ host, port, restPath, headers = null, query = null }) => {
    // Implement your DELETE handler here
};

module.exports = {
    _options,
    _get,
    _head,
    _post,
    _put,
    _delete
};