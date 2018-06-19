# What's a Sqvirrel?

Sqvirrel is a lightweight abstraction layer for promise-based connections to backend systems and web APIs.

It's designed to be easy to use: just create a Sqvirrel instance with a base host URL and any common headers that should be sent with all requests. After that, when you need to make requests just call the corresponding method (options, head, get, post, put, delete).

The goal of Sqvirrel is to be light, easy to learn and simple to use. Just like an actual squirrel.

## Plugins

* [sqvirrel-adapters](https://github.com/raybergholm/sqvirrel-adapters): ready-made adapters to run in various environments

## Instantiation

```javascript
    const instance = new Sqvirrel({
        host: "YOUR HOST URL",
        port: "YOUR PORT"      // defaults to 443
        headers: { }           // object of headers to include with all requests
        adapter: adapterObj    // apdater for 
    });
```

## Single requests
Call the instance's methods directly (options, head, get, post, put, delete) and handle the result. The return value should always be a promise.

## Batching requests
If you need to make a series of concurrent and independent calls:
Make the calls which go into the same batch and save the request into an iterable (array, Set, etc) 

Example:
```javascript
    const batch = [
        // add the requests which should be batched together, don't use await here!
        sqvirrel.get({/* params */}),   
        sqvirrel.post({/* params */}),
        sqvirrel.post({/* params */})
    ];

    // USING AWAIT

    const { success, errors } = await sqvirrel.batchRequest(batch); // pass all the batched requests, use await or .then

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