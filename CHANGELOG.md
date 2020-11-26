* Changed the way to access the events handler:

```js
// new way
import { events } from '@gosquared/logs2';

// commonjs
const { events } = require('@gosquared/logs2');

// old way (avoid)
const events = require('@gosquared/logs2/dist/src/events');
```
