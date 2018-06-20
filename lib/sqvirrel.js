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

        this.batch = [];

        if (adapter) {
            this.use(adapter);
        }

        const createBatchInterface = () => {
            const singleMethods = [
                "options",
                "head",
                "get",
                "post",
                "put",
                "delete"
            ];

            const batch = singleMethods.reduce((accumulator, method) => {
                accumulator[method] = (params) => {
                    const promise = this[method](params);
                    this._batchedRequests.push(promise);
                    return accumulator;
                };
                return accumulator;
            }, {});
        };

        this._batchedRequests = [];
        this.batch = createBatchInterface();
    }

    use(adapter) {
        if (adapter && typeof adapter === "object") {
            ADAPTER_METHODS.forEach((method) => {
                this[method] = adapter[method] && typeof adapter[method] === "function" ? adapter[method] : null;
            });
        }
        return this;
    }

    removeAdapter() {
        ADAPTER_METHODS.forEach((method) => {
            this[method] = null;
        });
        return this;
    }

    mergeHeaders(additionalHeaders) {
        this.headers = Object.assign({}, this.headers, additionalHeaders);
        return this;
    }

    setPort(port) {
        this.port = port;
        return this;
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
            return new Error("Missing _head adapter method");
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._head({ host: this.host, port: this.port, restPath, headers, query, ...others });
    }

    async get(params = {}) {
        if (!this._get) {
            return new Error("Missing _get adapter method");
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._get({ host: this.host, port: this.port, restPath, headers, query, ...others });
    }

    async post(params = {}) {
        if (!this._post) {
            return new Error("Missing _post adapter method");
        }

        const { restPath, body = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._post({ host: this.host, port: this.port, restPath, headers, body, ...others });
    }

    async put(params = {}) {
        if (!this._put) {
            return new Error("Missing _put adapter method");
        }

        const { restPath, body = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._put({ host: this.host, port: this.port, restPath, headers, body, ...others });
    }

    async delete(params = {}) {
        if (!this._delete) {
            return new Error("Missing _delete adapter method");
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        return await this._delete({ host: this.host, port: this.port, restPath, headers, query, ...others });
    }

    async multi(calls) {
        const response = await settle(calls);

        const results = bifurcate(response, (entry) => !entry.error);

        return {
            success: results[0],
            errors: results[1]
        };
    }

    async getBatchedResults(predicate, clearBatchedRequests = true) {
        const batchResponse = await settle(this._batchedRequests);
        const results = bifurcate(batchResponse, predicate ? predicate : (entry) => !entry.error);

        if (clearBatchedRequests) {
            this._batchedRequests = [];
        }

        return {
            success: results[0],
            errors: results[1]
        };
    }

    clearBatchedRequests() {
        this._batchedRequests = [];
        return this;
    }
}

module.exports = {
    Sqvirrel,
    ADAPTER_METHODS
};