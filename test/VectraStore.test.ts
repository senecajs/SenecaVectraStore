/* Copyright © 2024 Seneca Project Contributors, MIT License. */

require('dotenv').config({ path: '.env.local' })

import Seneca from 'seneca'
import VectraStore from '../src/VectraStore'

describe('VectraStore', () => {
  let seneca;

  beforeAll(async () => {
    seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(VectraStore, {
        vectra: {
          path: process.env.VECTRA_DB_PATH
        }
      });
    await seneca.ready();
  });

  test('load-plugin', () => {
    expect(VectraStore).toBeDefined();
    expect(seneca.export('VectraStore/native')).toBeDefined();
  });

  test('save and load item', async () => {
    const item = seneca.entity('foo/item').make$({
      test: 'save-load',
      text: 'Hello, Vectra!'
    });
    const vector = [0.1, 0.2, 0.3, 0.4, 0.5];
    const saved = await item.save$({ vector });
    expect(saved.id).toBeDefined();

    const loaded = await item.load$(saved.id);
    expect(loaded.text).toEqual('Hello, Vectra!');
  });

  test('list items', async () => {
    const vector = [0.1, 0.2, 0.3, 0.4, 0.5];
    await seneca.entity('foo/item').make$().data$({
      test: 'list',
      text: 'Item 1',
      vector
    }).save$();

    await seneca.entity('foo/item').make$().data$({
      test: 'list',
      text: 'Item 2',
      vector
    }).save$();

    const items = await seneca.act('role:entity,cmd:list,base:foo,name:item', {
      query: { test: 'list' }
    });
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  test('remove item', async () => {
    const item = seneca.entity('foo/item').make$({
      test: 'remove',
      text: 'Delete me'
    });
    const vector = [0.6, 0.7, 0.8, 0.9, 1.0];
    const saved = await item.save$({ vector });
    await item.remove$(saved.id);

    const loaded = await item.load$(saved.id);
    expect(loaded).toBeNull();
  });

  // Add more tests as needed to cover additional functionality
});

function makeSeneca() {
  return Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use(VectraStore, {
      vectra: {
        path: process.env.VECTRA_DB_PATH
      }
    });
}
