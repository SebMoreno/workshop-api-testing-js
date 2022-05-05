const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const { itemPraxisSchema } = require('./schema/ItemPraxis.schema');

const { expect } = chai;
chai.use(require('chai-json-schema'));

const baseUrl = process.env.PRAXIS_API_URL;

describe.only('Praxis Api', () => {
  it('consume GET service', async () => {
    const response = await agent.get(`${baseUrl}/items`);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.be.jsonSchema({
      title: 'List of items schema',
      type: 'array',
      items: itemPraxisSchema
    });
  });
});
