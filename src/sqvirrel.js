const DEFAULT_HTTPS_PORT = 443;

const adapterMethods = [
    "_options",
    "_head",
    "_get",
    "_post",
    "_put",
    "_delete"
];

class Sqvirrel {
    constructor({ host, port = DEFAULT_HTTPS_PORT, headers, adapter }) {
        if (!host) {
            throw new Error("host URL is mandatory");
        }

        this.host = host;
        this.port = port;
        this.headers = headers;

        if (adapter) {
            this.applyAdapter(adapter);
        }
    }

    applyAdapter(adapter) {
        if (adapter && typeof adapter === "object") {
            adapterMethods.forEach((method) => {
                if (adapter[method] && typeof adapter[method] === "function") {
                    this[method] = method;
                } else {
                    this[method] = null;
                    console.error(`Invalid entry ${method} in applyAdapter`);
                }
            });
        }
    }

    async options({ restPath, additionalHeaders }) {
        if (!this._options) {
            throw new Error("Missing OPTIONS adapter method");
        }

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return this._options({ host: this.host, restPath, headers });
    }

    async get({ restPath, query, additionalHeaders }) {
        if (!this._get) {
            throw new Error("Missing GET adapter method");
        }

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return this._get({ host: this.host, restPath, headers, query });
    }

    async head({ restPath, query = null, additionalHeaders = {} }) {
        if (!this._head) {
            throw new Error("Missing HEAD adapter method");
        }

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return this._head({ host: this.host, restPath, headers, query });
    }

    async post({ restPath, body, additionalHeaders }) {
        if (!this._post) {
            throw new Error("Missing POST adapter method");
        }

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return this._post({ host: this.host, restPath, headers, body });
    }

    async put({ restPath, body = "", additionalHeaders = {} }) {
        if (!this._put) {
            throw new Error("Missing PUT adapter method");
        }

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return this._post({ host: this.host, restPath, headers, body });
    }

    async delete({ restPath, query = null, additionalHeaders = {} }) {
        if (!this._delete) {
            throw new Error("Missing DELETE adapter method");
        }

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return this._delete({ host: this.host, restPath, headers, query });
    }
}

export default Sqvirrel;