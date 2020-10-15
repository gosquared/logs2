import Logger from "../src/logger"
import events from '../src/events';

import { cw } from './aws';

const group = 'test1';

it('saves log messages', done => {
  const logger = new Logger(cw, group);
  logger.log('test', { test: 1 });
  events.on('save', messages => {
    done();
  });
  logger.save();
});
