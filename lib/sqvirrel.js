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
        const { host, port = DEFAULT_HTTPS_PORT, headers = {}, adapter = null, debugMode = false } = params;

        if (!host) {
            throw new Error("Host URL is mandatory");
        }

        this.host = host;
        this.port = port;
        this.headers = headers;
        this.debugMode = debugMode;

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

            return singleMethods.reduce((accumulator, method) => {
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

    setDebugMode(debugMode) {
        this.debugMode = debugMode;
        return this;
    }

    async options(params = {}) {
        if (!this._options) {
            throw new Error("Missing _options adapter method");
        }

        if (this.debugMode) {
            console.log("OPTIONS - incoming params:", params);
        }

        const { restPath, additionalHeaders, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        const response = await this._options({ host: this.host, port: this.port, restPath, headers, others });

        if (this.debugMode) {
            console.log("OPTIONS - received response:", response);
        }

        return response;
    }

    async head(params = {}) {
        if (!this._head) {
            return new Error("Missing _head adapter method");
        }

        if (this.debugMode) {
            console.log("HEAD - incoming params:", params);
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        const response = await this._head({ host: this.host, port: this.port, restPath, headers, query, ...others });

        if (this.debugMode) {
            console.log("HEAD - received response:", response);
        }

        return response;
    }

    async get(params = {}) {
        if (!this._get) {
            return new Error("Missing _get adapter method");
        }

        if (this.debugMode) {
            console.log("GET - incoming params:", params);
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        const response = await this._get({ host: this.host, port: this.port, restPath, headers, query, ...others });

        if (this.debugMode) {
            console.log("GET - received response:", response);
        }

        return response;
    }

    async post(params = {}) {
        if (!this._post) {
            return new Error("Missing _post adapter method");
        }

        if (this.debugMode) {
            console.log("POST - incoming params:", params);
        }

        const { restPath, body = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        const response = await this._post({ host: this.host, port: this.port, restPath, headers, body, ...others });

        if (this.debugMode) {
            console.log("POST - received response:", response);
        }

        return response;
    }

    async put(params = {}) {
        if (!this._put) {
            return new Error("Missing _put adapter method");
        }

        if (this.debugMode) {
            console.log("PUT - incoming params:", params);
        }

        const { restPath, body = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        const response = await this._put({ host: this.host, port: this.port, restPath, headers, body, ...others });

        if (this.debugMode) {
            console.log("PUT - received response:", response);
        }

        return response;
    }

    async delete(params = {}) {
        if (!this._delete) {
            return new Error("Missing _delete adapter method");
        }

        if (this.debugMode) {
            console.log("DELETE - incoming params:", params);
        }

        const { restPath, query = null, additionalHeaders = {}, ...others } = params;

        const headers = Object.assign({}, this.headers, additionalHeaders);
        const response = await this._delete({ host: this.host, port: this.port, restPath, headers, query, ...others });

        if (this.debugMode) {
            console.log("DELETE - received response:", response);
        }

        return response;
    }

    async multi(calls) {
        if (this.debugMode) {
            console.log("MULTI - incoming params:", calls);
        }

        const response = await settle(calls);

        if (this.debugMode) {
            console.log("MULTI - received response:", response);
        }

        const [success, errors] = bifurcate(response, (entry) => !entry.error);
        const result = {
            success,
            errors
        };

        if (this.debugMode) {
            console.log("MULTI - returning result:", result);
        }

        return result;
    }

    async getBatchedResults(predicate, clearBatchedRequests = true) {
        if (this.debugMode) {
            console.log("BATCH - executing batch request using:", this._batchedRequests);
        }

        const batchResponse = await settle(this._batchedRequests);

        if (this.debugMode) {
            console.log("BATCH - received response:", batchResponse);
        }

        const defaultPredicate = (entry) => !entry.error;

        const [success, errors] = bifurcate(batchResponse, predicate ? predicate : defaultPredicate);
        const result = {
            success,
            errors
        };

        if (clearBatchedRequests) {
            this._batchedRequests = [];
        }

        if (this.debugMode) {
            console.log("BATCH - returning result:", result);
        }

        return result;
    }

    clearBatchedRequests() {
        this._batchedRequests = [];
        return this;
    }
}

const createInstance = (params) => new Sqvirrel(params);

module.exports = {
    Sqvirrel,
    createInstance,
    ADAPTER_METHODS
};