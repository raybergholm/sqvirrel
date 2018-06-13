# What's a Sqvirrel?

Sqvirrel is a lightweight abstraction layer for promise-based connections to backend systems and web APIs.

It's designed to be easy to use: just create a Sqvirrel instance with some common. When you need to make requests, call the corresponding method (options, head, get, post, put, delete).

The goal of Sqvirrel is to be light, easy to learn and simple to use. Just like an actual squirrel.

## Instantiation

```javascript
    const instance = new Sqvirrel({
        host = "YOUR HOST URL",
        port = "YOUR PORT"      // defaults to 443
        headers = { }           // object of headers to include with all requests
        adapter = adapterObj    // add one of the adapters in the adapters folder depending on your runtime
    });
```

## Single requests


## Batching requests


## Adapters

Adapters represent the layer between a Sqvirrel instance and a HTTPS request library. Ready-made adapters:
* nodeHttps: Use this if you're running in a Node.js runtime (version 8.10 LTS or higher)
* superagent: Use this if you're using [SuperAgent](http://visionmedia.github.io/superagent/)
* xmlHttpRequest: Use this if you're running on a browser with no other dependencies

Alternatively, feel free to implement your own adapter.

Adapters can be specified in the constructor or dynamically using the .applyAdapter() method. As Sqvirrel is environment and library agnostic, it is up to you to supply the corresponding adapter.