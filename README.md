# Redis Read from Stream

read stream message one by one from redis

### Usage

```javascript
const ReadStream = require("read-redis-stream");

function onMessage(err, data) {
    console.log(err, data);
}

const stop = ReadStream(null, STREAM_ID, onMessage);

setTimeout(stop, 1000);
```
