# What's a Sqvirrel?

Sqvirrel is a lightweight abstraction layer for promise-based connections to backend systems and web APIs.

It's designed to be easy to use: just create a Sqvirrel instance with a base host URL and any common headers that should be sent with all requests. After that, when you need to make requests just call the corresponding method (options, head, get, post, put, delete).

The goal of Sqvirrel is to be light, easy to learn and simple to use. Just like an actual squirrel.

## Plugins

* [sqvirrel-adapters](https://github.com/raybergholm/sqvirrel-adapters): ready-made adapters to run in various environments

## Creating an instance

A Sqvirrel instance must always contain the base host URL in the constructor, otherwise it will throw an error. All other fields are optional during instantiation and can be supplied later.

Some examples of instantiation:

* Supply everything in the constructor
```javascript
    const instance = new Sqvirrel({
        host: "https://www.myurl.com", 
        port: 433           // defaults to 443
        headers: {     
            "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
            "Content-Type": "application/json"
        }                   // object of headers to include with all requests (defaults to an empty object)   
        adapter: adapter    // adapter for a HTTP library
    });
```
* A separate use() call
```javascript
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
```
* Chaining methods is an option
```javascript
    // OR CHAIN USE() AFTER THE CONSTRUCTOR

    const instance = new Sqvirrel({
        host: "https://www.myurl.com",
        headers: { 
            "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
            "Content-Type": "application/json"
        }
    })
    .use(adapter);
```
* Multiple chained methods are also fine
```javascript
    // OR CHAIN MULTIPLE THINGS TOGETHER

    const instance = new Sqvirrel({
        host: "https://www.myurl.com"
    })
    .use(adapter)
    .setPort(443)
    .mergeHeaders({
        "Authorization": "Basic ZWFzdGVyX2VnZzpmb3JfeW91IQ==",
        "Content-Type": "application/json"
    });
```

Chainable methods:
`constructor`, `use`, `setPort`, `mergeHeaders`, `clearBatchedRequests`

## Making requests
Sqvirrel supports various ways of making requests:

* Single: simple use case, call the host and get a response
* Multi: group a series of requests and send them to the host together
* Batch: an "add as you go" approach: requests are appended to the instance's list of batched requests and the results are accessed with `getBatchedResults`

### Single requests
Call the instance's request methods directly (`options`, `head`, `get`, `post`, `put`, `delete`) and return the result as a promise.

### Multiple requests
If you need to make some concurrent and independent calls together:
* Make the calls which go into the same batch and store the request in an iterable (array, Set, etc) 
* Call the multi method with the requests as the input parameter. This will process the requests and split the results into success/error.
* Access the return value of batchRequests using await or .then

Example:
```javascript
    const requests = [
        // add the requests which should be sent together, don't use await here!
        instance.get({/* params */}),   
        instance.post({/* params */}),
        instance.post({/* params */})
    ];

    // USING AWAIT

    const { success, errors } = await instance.multi(requests); // pass all the batched requests, use await or .then

    success.forEach((successfulEntry) => {
        // handle successful requests
    });

    errors.forEach((errorEntry) => {
        // handle errors
    });

    // USING .THEN

    const batchResponse = instance.multi(batch);

    batchResponse.then(({ success, errors }) => {
        success.forEach((successfulEntry) => {
            // handle successful requests
        });

        errors.forEach((errorEntry) => {
            // handle errors
        });
    })
```

### Batch requests
Sometimes you end up in a situation where you want to make a bunch of requests but it doesn't make sense to process the response yet. For this scenario, Sqvirrel has batch requests.

To use batched requests, chain your request methods after `batch` like this:

For comparison, this is a standard and 
```javascript
    // Single request call, no batch
    response = instance.get(params);
    console.log(response); // response is a promise

    // Batch request call, the method was chained after batch
    response = instance.batch.get(params);
    console.log(response); // response is instance.batch
```

#### Batch request
Supported batch methods:
`options`, `head`, `get`, `post`, `put`, `delete`

Note that `multi` is not supported when using `batch`.

#### Chaining batch request
As shown in the previous exmaple, instance.batch.{method} returns instance.batch. This means you're free to chain calls to batch:
```javascript
    instance.batch
        .get(params)
        .get(params)
        .post(params); // this will result in three batched promises 
```

#### Invalid chaining
```javascript
    instance.get(params).batch.post(params);
    // TypeError: request methods return a promise and are not meant to be chained like this
```

### Threading requests
TODO: in-order request threads

## Adapters

Sqvirrel allows you to use any JS HTTP client so it's ok in any ES6 compatible environment as long as you have a valid adapter connecting to the HTTP client library. Adapters represent the layer between a Sqvirrel instance and a HTTP client, see [sqvirrel-adapters](https://github.com/raybergholm/sqvirrel-adapters) for some examples.

Alternatively, feel free to implement your own adapter. An adapter is ultimately an map fulfilling the following criteria:

* Must contain the properties `_options`, `_head`, `_get`, `_post`, `_put`, `_delete` which corresponds to an adapter method
* Each adapter method accepts its parameters in map format
* Each adapter method returns a promise