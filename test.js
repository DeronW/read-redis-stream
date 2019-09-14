const assert = require("assert");
const redis = require("redis");

assert.equal(1 + 1, 2);

const ReadStream = require("./index");

const testClient = redis.createClient("redis://127.0.0.1:6379");
const STREAM_ID = "stream-id";

function onMessage(err, data) {
    console.log(err, data);
    assert.equal(err, null);
    let [key, value] = data;
    assert.equal(key, "some key");
    assert.equal(value, "some value");
}

const stopReadStream = ReadStream(null, STREAM_ID, onMessage);

setTimeout(() => {
    testClient.sendCommand("xadd", [STREAM_ID, "*", "some key", "some value"]);
}, 1000);

setTimeout(() => {
    testClient.end(true);
    stopReadStream();
}, 2000);
