# Install
```bash
npm i @gosquared/logs2
```
You may need to configure npm with a [Github packages token](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages).

# Usage

Create with AWS credentials:

```javascript
const { getLogger } = require('@gosquared/logs2');
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
const { getLogger } = require('@gosquared/logs2');
const logGroup = 'test';
const logger = getLogger(logGroup);

const message = 'test';
const data = { test: 1 };

logger.log(message, data);
```

## Shut down
Save pending logs to cloudwatch before exit:

```javascript
const logs = require('@gosquared/logs2');

async function stop() {
  await logs.stop();
}
```

## Error
Errors are emitted as events:

```javascript
const events = require('@gosquared/logs2/src/events');
events.on('error', e => {
  console.error(e);
});
```
