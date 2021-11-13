import assert from 'assert';
import { getLogger, events } from '../main';

describe('limits', () => {
  it('clears queue when messsage limit reached', done => {
    const group = 'test';
    const settings = {};
    const logger = getLogger(group, settings);
    logger.limit = 1;

    events.once('error', e => {
      assert.strictEqual<string>(
        e.message,
        'message limit reached'
      );
      done();
    });

    logger.log('test', {});
  });
})
