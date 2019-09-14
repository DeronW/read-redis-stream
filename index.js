const { createClient, RedisClient } = require("redis");

let streamName = "_undefined";
let msgId = "$";
let blockTime = 60 * 1000;
let onCallback;
let disabled = false;
let redisClient;
let independent = false;

function cmd() {
    redisClient.sendCommand(
        "xread",
        ["block", blockTime, "count", 1, "streams", streamName, msgId],
        onMessage
    );
}

function onMessage(err, data) {
    if (disabled) return;

    setImmediate(() => {
        if (err) onCallback(err, null);
        if (data) onCallback(null, data[0][1][0][1]);
    });

    if (err) {
        setTimeout(cmd, 3000);
    } else {
        if (data) msgId = data[0][1][0][0];
        cmd();
    }
}

function stop() {
    disabled = true;
    if (independent) redisClient.end(true);
}

module.exports = async function read(client = "redis://127.0.0.1:6379", stream, callback) {
    if (!(client instanceof RedisClient)) {
        independent = true;
        client = createClient(client);
    }

    if (!(client instanceof RedisClient))
        throw TypeError(
            `client is not instance of redis.RedisClient, see: https://www.npmjs.com/package/redis`
        );

    if (typeof callback !== "function") throw TypeError("callback parameter should be a funciton");
    if (!stream || stream.indexOf(" ") > 0) throw TypeError("stream parameter illegal");

    onCallback = callback;
    streamName = stream;
    redisClient = client;
    cmd();
    return stop;
};
