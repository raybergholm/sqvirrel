const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should;

const { Sqvirrel, ADAPTER_METHODS } = require("../lib/Sqvirrel");

const expectedAdapterMethods = [
    "_options",
    "_head",
    "_get",
    "_post",
    "_put",
    "_delete"
];

describe("Sqvirrel tests - base", () => {
    describe("ADAPTER_METHODS enum", () => {
        it("ADAPTER_METHODS contains a list of method names", () => { 
            expect(ADAPTER_METHODS)
                .to.be.an("array").with.lengthOf(6)
                .and.has.members(expectedAdapterMethods);
        });
    });

    describe("Basic Sqvirrel instantiation", () => {
        const testHost = "https://www.google.com";
        const instance = new Sqvirrel({
            host: testHost
        });

        it("Host matches the input", () => {
            expect(instance.host).to.equal(testHost);
        });

        it("Default port is 443", () => {
            expect(instance.port).to.equal(443);
        });

        it("Instance with no adapter - request methods should throw", async () => {
            expect(
                (async () => await instance.options())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.head())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.get())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.post())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.put())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.delete())()
            ).to.eventually.be.rejectedWith(Error);
        });

        it("No host should throw an error", () => {
            const createBadInstance = () => {
                return new Sqvirrel();
            };
            expect(createBadInstance).to.throw("Host URL is mandatory");
        });
    });

    describe("Sqvirrel instantiation with a dummy adapter", () => {
        const completeDummyAdapter = {
            _options: async () => {
                return Promise.resolve("OPTIONS");
            },
            _head: async () => {
                return Promise.resolve("HEAD");
            },
            _get: async () => {
                return Promise.resolve("GET");
            },
            _post: async () => {
                return Promise.resolve("POST");
            },
            _put: async () => {
                return Promise.resolve("PUT");
            },
            _delete: async () => {
                return Promise.resolve("DELETE");
            }
        }; 

        const testHost = "https://www.google.com";
        const instance = new Sqvirrel({
            host: testHost,
            adapter: completeDummyAdapter
        });

        it("Instance with a dummy adapter - methods return promises", async () => {
            expect(await instance.options()).to.equal("OPTIONS");
            expect(await instance.head()).to.equal("HEAD");
            expect(await instance.get()).to.equal("GET");
            expect(await instance.post()).to.equal("POST");
            expect(await instance.put()).to.equal("PUT");
            expect(await instance.delete()).to.equal("DELETE");
        });

        it("Unmount adapter succeeds, request methods should now throw errors", async () => {
            instance.removeAdapter();

            expect(
                (async () => await instance.options())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.head())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.get())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.post())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.put())()
            ).to.eventually.be.rejectedWith(Error);

            expect(
                (async () => await instance.delete())()
            ).to.eventually.be.rejectedWith(Error);
        });

        it("Dynamic mounting of adapter", async () => {
            const partialDummyAdapter = {
                _get: async () => {
                    return Promise.resolve("GET");
                }
            }; 

            instance.applyAdapter(partialDummyAdapter);

            expect(await instance.get()).to.equal("GET");

            expect(
                (async () => await instance.post())()
            ).to.eventually.be.rejectedWith(Error);
        });
    });
});