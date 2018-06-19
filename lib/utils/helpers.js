// Allow a map of promises to be thenable after all promises have settled (resolve or reject)
const settle = (promises) => Promise.all(
    Array.from(promises).map((promise) =>
        Promise.resolve(promise).then(
            (response) => ({ response }),
            (error) => ({ error })
        )
    ));

// Split array into two based on the predicate: true goes to the first element, false goes to the second
const bifurcate = (arr, predicate) =>
    arr.reduce((accumulator, value, index) => (accumulator[predicate(value, index) ? 0 : 1].push(value), accumulator), [[], []]);

module.exports = {
    settle,
    bifurcate
};