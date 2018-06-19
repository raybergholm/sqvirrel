const { settle, bifurcate } = require("./utils/helpers");

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

        const { restPath, additionalHeaders, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._options({ host: this.host, port: this.port, restPath, headers, others });
    }

    async head(params = {}) {
        if (!this._head) {
            return Promise.reject(new Error("Missing _head adapter method"));
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._head({ host: this.host, port: this.port, restPath, headers, query, ...others });
    }

    async get(params = {}) {
        if (!this._get) {
            return Promise.reject(new Error("Missing _get adapter method"));
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._get({ host: this.host, port: this.port, restPath, headers, query, ...others });
    }

    async post(params = {}) {
        if (!this._post) {
            return Promise.reject(new Error("Missing _post adapter method"));
        }

        const { restPath, body = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._post({ host: this.host, port: this.port, restPath, headers, body, ...others });
    }

    async put(params = {}) {
        if (!this._put) {
            return Promise.reject(new Error("Missing _put adapter method"));
        }

        const { restPath, body = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._put({ host: this.host, port: this.port, restPath, headers, body, ...others });
    }

    async delete(params = {}) {
        if (!this._delete) {
            return Promise.reject(new Error("Missing _delete adapter method"));
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._delete({ host: this.host, port: this.port, restPath, headers, query, ...others });
    }

    async batchRequest(calls){
        const response = await settle(calls);
        
        const results = bifurcate(response, (entry) => !entry.error);

        return {
            responses: results[0],
            errors: results[1]
        };
    }
}

module.exports = {
    Sqvirrel,
    ADAPTER_METHODS
};