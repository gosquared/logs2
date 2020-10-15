
# Usage

Create with AWS credentials:

```javascript
const config = {
  aws: {
    region: 'us-east-1',
    accessKeyId,
    secretAccessKey
  }
};

const logGroup = 'test';
const logger = getLogger(logGroup, config);

const message = 'test';
const data = { test: 1 };

logger.log(message, data);
```

Use AWS credentials from environment:

```javascript
const logGroup = 'test';
const logger = getLogger(logGroup);

const message = 'test';
const data = { test: 1 };

logger.log(message, data);
```
