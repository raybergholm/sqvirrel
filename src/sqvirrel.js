const DEFAULT_HTTPS_PORT = 443;

const ADAPTER_METHODS = Object.freeze([
    "_options",
    "_head",
    "_get",
    "_post",
    "_put",
    "_delete"
]);

class Sqvirrel {
    constructor(params = {}) {
        const { host, port = DEFAULT_HTTPS_PORT, headers = {}, adapter = null } = params;

        if (!host) {
            throw new Error("Host URL is mandatory");
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
            ADAPTER_METHODS.forEach((method) => {
                if (adapter[method] && typeof adapter[method] === "function") {
                    this[method] = adapter[method];
                } else {
                    this[method] = null;
                    // console.error(`Invalid entry ${method} in applyAdapter`);
                }
            });
        }
    }

    removeAdapter() {
        ADAPTER_METHODS.forEach((method) => {
            this[method] = method;
        });
    }

    async options(params = {}) {
        if (!this._options) {
            throw new Error("Missing _options adapter method");
        }

        const { restPath, additionalHeaders } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._options({ host: this.host, restPath, headers });
    }

    async head(params = {}) {
        if (!this._head) {
            return Promise.reject(new Error("Missing _head adapter method"));
        }

        const { restPath, query = null, additionalHeaders = {} } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._head({ host: this.host, restPath, headers, query });
    }

    async get(params = {}) {
        if (!this._get) {
            return Promise.reject(new Error("Missing _get adapter method"));
        }

        const { restPath, query = null, additionalHeaders = {} } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._get({ host: this.host, restPath, headers, query });
    }

    async post(params = {}) {
        if (!this._post) {
            return Promise.reject(new Error("Missing _post adapter method"));
        }

        const { restPath, body = null, additionalHeaders = {} } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._post({ host: this.host, restPath, headers, body });
    }

    async put(params = {}) {
        if (!this._put) {
            return Promise.reject(new Error("Missing _put adapter method"));
        }

        const { restPath, body = null, additionalHeaders = {} } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._put({ host: this.host, restPath, headers, body });
    }

    async delete(params = {}) {
        if (!this._delete) {
            return Promise.reject(new Error("Missing _delete adapter method"));
        }

        const { restPath, query = null, additionalHeaders = {} } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._delete({ host: this.host, restPath, headers, query });
    }
}

module.exports = {
    Sqvirrel,
    ADAPTER_METHODS
};