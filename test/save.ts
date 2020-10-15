import cuid from 'cuid';
import { save, retry } from "../src/save";

import { cw } from './aws';
import { create as createLogStream } from '../src/logStream';
import { expect } from 'chai';

const group = 'test1';

const message1 = {
  text: 'hi',
  data: { test: 1 },
  timestamp: new Date()
}

const messages = [ message1 ];

it('errors on a log stream with messages', async () => {
  const stream = cuid();
  await createLogStream(cw, group, stream);
  await save(cw, group, stream, messages);

  let token;
  try {
    await save(cw, group, stream, messages);
  } catch(e) {
    // cloudwatch replies with the sequence token we should use
    const match = e.message.match(/sequenceToken: (.+)/);
    token = match[1];
    expect(token);
  }
});

it('retry saves messages to a non empty log stream', async () => {
  const stream = cuid();
  await createLogStream(cw, group, stream);
  await save(cw, group, stream, messages);
  await retry(cw, group, stream, messages);
})
