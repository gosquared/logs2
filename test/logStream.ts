import { create } from "../src/logStream";
import cuid from 'cuid';
import { expect } from 'chai';

import { cw } from './aws';

const group = 'test1';
const stream = cuid();

it('creates log stream', async () => {
  const result = await create(cw, group, stream);
});

it('fails to create existing log stream', async () => {
  let result;

  try {
    result = await create(cw, group, stream);
  } catch(e) {
    expect(e.code).to.equal('ResourceAlreadyExistsException');
  }
});
