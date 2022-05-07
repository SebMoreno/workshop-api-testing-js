const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const { itemPraxisSchema } = require('./schema/ItemPraxis.schema');

const { expect } = chai;
chai.use(require('chai-json-schema'));

const baseUrl = process.env.PRAXIS_API_URL;

describe('Praxis Api', () => {
  it('consume GET service', async () => {
    const response = await agent.get(`${baseUrl}/items`);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.be.jsonSchema({
      title: 'List of items schema',
      type: 'array',
      items: itemPraxisSchema
    });
  });

  it.only('test', async () => {
    const { body } = await agent.get(`${baseUrl}/items`);
    console.log(1);
    body.forEach(async (item, i) => {
      await agent.delete(`${baseUrl}/items/${item.id}`);
      console.log(`1.${i}`);
    });
    console.log(2);
    const resp = await agent.get(`${baseUrl}/items`);
    console.log(3);
    expect(resp.body.length).to.equal(0);
  });
  it('should ', async () => {
    await agent.post(`${baseUrl}/items/batch`).send([{
      name: 'Chocolate',
      sellIn: 200,
      quality: 80,
      type: 'LEGENDARY'
    },
    {
      name: 'salsa',
      sellIn: 200,
      quality: 80,
      type: 'NORMAL'
    },
    {
      name: 'Rosalia',
      sellIn: 200,
      quality: 10,
      type: 'TICKETS'
    }]);
  });
});

/*
const { body: items } = await agent.get(`${baseUrl}/items`);
await Promise.all(items.map((item) => agent.delete(`${baseUrl}/items/${item.id}`)));
const { body: { length: itemsAmmount } } = await agent.get(`${baseUrl}/items`);
expect(itemsAmmount).to.equal(0);

const { body: items } = await agent.get(`${baseUrl}/items`);
// await Promise.all(items.map((item) => agent.delete(`${baseUrl}/items/${item.id}`)));
console.log(1);
items.forEach(async (item, i) => {
  await agent.delete(`${baseUrl}/items/${item.id}`);
  console.log('1.' + i);
});
console.log(2);
const { body: { length: itemsAmmount } } = await agent.get(`${baseUrl}/items`);
console.log(3);
await agent.get(`${baseUrl}/items`);
expect(itemsAmmount).to.equal(0);
*/
