# What's a Sqvirrel?

Sqvirrel is a lightweight abstraction layer for promise-based connections to backend systems and web APIs.

It's designed to be easy to use: just create a Sqvirrel instance with a base host URL and any common headers that should be sent with all requests. After that, when you need to make requests just call the corresponding method (options, head, get, post, put, delete).

The goal of Sqvirrel is to be light, easy to learn and simple to use. Just like an actual squirrel.

## Plugins

* [sqvirrel-adapters](https://github.com/raybergholm/sqvirrel-adapters): ready-made adapters to run in various environments

## Instantiation

A Sqvirrel instance must always contain the base host URL in the constructor, otherwise it will throw an error. All other fields are optional during instantiation and can be supplied later.

```javascript
    // YOU CAN PUT EVERYTHING IN THE CONSTRUCTOR

    const instance = new Sqvirrel({
        host: "https://www.myurl.com", 
        port: 433           // defaults to 443
        headers: {     
            "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
            "Content-Type": "application/json"
        }                   // object of headers to include with all requests (defaults to an empty object)   
        adapter: adapter    // adapter for a HTTP library
    });

    // OR CALL USE() SEPARATELY AFTER INSTANTIATION

    const instance = new Sqvirrel({
        host: "https://www.myurl.com", 
        port: 433
        headers: { 
            "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
            "Content-Type": "application/json"
        }
    });
    instance.use(adapter)

    // OR CHAIN USE() AFTER THE CONSTRUCTOR

    const instance = new Sqvirrel({
        host: "https://www.myurl.com",
        headers: { 
            "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
            "Content-Type": "application/json"
        }
    }).use(adapter);

    // OR CHAIN MULTIPLE THINGS

    const instance = new Sqvirrel({
        host: "https://www.myurl.com"
    }).use(adapter).mergeHeaders({
        "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
        "Content-Type": "application/json"
    });
```

## Single requests
Call the instance's methods directly (options, head, get, post, put, delete) and handle the result. The return value should always be a promise.

## Batching requests
If you need to make a series of concurrent and independent calls:
* Make the calls which go into the same batch and store the request in an iterable (array, Set, etc) 
* Call the batchRequests method with the requests as the input parameter. This will process the requests and split the results into success/error.
* Access the return value of batchRequests using await or .then

Example:
```javascript
    const batch = [
        // add the requests which should be batched together, don't use await here!
        instance.get({/* params */}),   
        instance.post({/* params */}),
        instance.post({/* params */})
    ];

    // USING AWAIT

    const { success, errors } = await instance.batchRequest(batch); // pass all the batched requests, use await or .then

    success.forEach((successfulEntry) => {
        // handle successful requests
    });

    errors.forEach((errorEntry) => {
        // handle errors
    });

    // USING .THEN

    const batchResponse = sqvirrel.batchRequest(batch);

    batchResponse.then(({ success, errors }) => {
        success.forEach((successfulEntry) => {
            // handle successful requests
        });

        errors.forEach((errorEntry) => {
            // handle errors
        });
    })
```

## Threading requests
TODO: in-order request threads

## Adapters

Sqvirrel allows you to use any JS HTTP client so it does not res Adapters represent the layer between a Sqvirrel instance and a HTTP client. [sqvirrel-adapters](https://github.com/raybergholm/sqvirrel-adapters) contains some adapters 
* nodeHttps: Use this if you're running in a Node.js runtime (version 8.10 LTS or higher)
* superagent: Use this if you're using [SuperAgent](http://visionmedia.github.io/superagent/)
* xmlHttpRequest: Use this if you're running on a browser with no other dependencies

Alternatively, feel free to implement your own adapter.

Adapters can be specified in the constructor or dynamically using the .use() method. As Sqvirrel is environment and library agnostic, it is up to you to supply the corresponding adapter.