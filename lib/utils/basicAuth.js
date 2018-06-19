const createBasicAuthString = ({ username, password }) => {
    let credentials;
    if (Buffer) {
        // Node
        credentials = Buffer.from(`${username}:${password}`).toString("base64");
    } else if (btoa) {
        // Browser
        credentials = btoa(`${username}:${password}`);
    }

    return `Basic ${credentials}`;
};

module.exports = {
    createBasicAuthString
};