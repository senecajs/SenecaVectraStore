require('dotenv').config({ path: '.env.local' });

const Seneca = require('seneca');
const VectraStore = require('./path/to/VectraStore'); // Adjust the path as necessary

async function run() {
  const seneca = Seneca({ legacy: false })
    .test() // use .test() for test mode which suppresses logs except errors
    .use('promisify')
    .use('entity')
    .use(VectraStore, {
      vectra: {
        path: process.env.VECTRA_DB_PATH, // Specify the path to Vectra DB
      }
    });

  await seneca.ready();

  // Example data to save and then load
  const exampleData = {
    text: 'Hello Vectra',
    vector: [0.1, 0.2, 0.3, 0.4, 0.5]
  };

  // Saving data
  const savedEntity = await seneca.entity('foo/item')
    .make$(exampleData)
    .save$();
  console.log('Saved:', savedEntity);

  // Loading data using the ID from saved data
  const loadedEntity = await seneca.entity('foo/item').load$(savedEntity.id);
  console.log('Loaded:', loadedEntity);

  // Optionally, list all items
  const items = await seneca.entity('foo/item').list$();
  console.log('All items:', items);
}

run().catch(err => console.error(err));
