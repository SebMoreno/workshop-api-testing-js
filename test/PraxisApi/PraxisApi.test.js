const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
chai.use(require('chai-json-schema'));

const { expect } = chai;

const { resetDB, deleteItemsFromDB } = require('../util/utils');
const { itemPraxisSchema } = require('../schema/ItemPraxis.schema');

const listOfItemsSchema = {
  title: 'List of items schema',
  type: 'array',
  items: itemPraxisSchema
};

const baseUrl = process.env.PRAXIS_API_URL || 'http://localhost:8080/api';

const listOfItems = [
  {
    name: 'Chocolate',
    sellIn: 0,
    quality: 80,
    type: 'LEGENDARY'
  },
  {
    name: 'salsa',
    sellIn: 42,
    quality: 23,
    type: 'NORMAL'
  },
  {
    name: 'Rosalia',
    sellIn: 5,
    quality: 10,
    type: 'TICKETS'
  }
];
const listOfItemsWithQualityUpdated = [
  {
    name: 'Chocolate',
    quality: 80,
    sellIn: 0,
    type: 'LEGENDARY'
  },
  {
    name: 'salsa',
    quality: 22,
    sellIn: 41,
    type: 'NORMAL'
  },
  {
    name: 'Rosalia',
    quality: 13,
    sellIn: 4,
    type: 'TICKETS'
  }
];

describe('Praxis Api', () => {
  describe('services for GET elements', async () => {
    let itemsInDB;
    beforeEach(async () => {
      await resetDB(baseUrl);
      itemsInDB = (await agent.post(`${baseUrl}/items/batch`).send(listOfItems)).body;
    });

    it('should return a list of items', async () => {
      const { body, status } = await agent.get(`${baseUrl}/items`);
      expect(status).to.equal(statusCode.OK);
      expect(body).to.be.jsonSchema(listOfItemsSchema);
      expect(body).to.deep.equal(itemsInDB);
    });

    it('should return the requested item', async () => {
      const testItem = itemsInDB[0];
      const { body, status } = await agent.get(`${baseUrl}/items/${testItem.id}`);
      expect(status).to.equal(statusCode.OK);
      expect(body).to.be.jsonSchema(itemPraxisSchema);
      expect(body).to.deep.equal(testItem);
    });

    it('should give NOT FOUND error when looking for a non existing item', async () => {
      const nonExistingItemId = Math.max(...itemsInDB.map((item) => item.id)) + 1;
      const { body, status } = await agent.get(`${baseUrl}/items/${nonExistingItemId}`).ok(() => true);
      expect(status).to.equal(statusCode.NOT_FOUND);
      expect(body).to.contains({ error: 'Not Found' });
    });
  });

  describe('create elements with POST services', async () => {
    beforeEach(async () => {
      await deleteItemsFromDB(baseUrl, listOfItems);
    });
    it('with a single object', async () => {
      const testItem = listOfItems[0];
      const { body, status } = await agent.post(`${baseUrl}/items`).send(testItem);
      expect(status).to.equal(statusCode.CREATED);
      expect(body).to.be.jsonSchema(itemPraxisSchema);
      expect(body).to.contains(testItem);
    });
    it('with a list of items', async () => {
      const { body, status } = await agent.post(`${baseUrl}/items/batch`).send(listOfItems);
      expect(status).to.equal(statusCode.CREATED);
      expect(body).to.be.jsonSchema(listOfItemsSchema);
      expect(body.map(({ id, ...it }) => it)).to.deep.equals(listOfItems);
    });
    it('should avoid creation of a non item object', async () => {
      const messageRegex = /There is an issue with the field (\w+), \1 is mandatory/;
      const testItem = { name: 'non item' };
      const { body, status } = await agent.post(`${baseUrl}/items`).send(testItem).ok(() => true);
      expect(status).to.equal(statusCode.BAD_REQUEST);
      expect(body.message).to.match(messageRegex);
    });
  });

  describe('update elements with PUT services', async () => {
    let itemInDB = {
      name: 'Celular',
      sellIn: 15,
      quality: 30,
      type: 'NORMAL'
    };
    beforeEach(async () => {
      await resetDB(baseUrl);
      itemInDB = (await agent.post(`${baseUrl}/items`).send(itemInDB)).body;
    });

    it('should update the requested item', async () => {
      const testItem = { ...itemInDB, quality: 40 };
      const { body: updatedItem, status } = await agent.put(`${baseUrl}/items/${testItem.id}`)
        .send(testItem);
      expect(status).to.equal(statusCode.OK);
      expect(updatedItem).to.be.jsonSchema(itemPraxisSchema);
      expect(updatedItem).to.deep.equal(testItem);
    });
    it('should avoid modification of a non existing object', async () => {
      const testItem = { name: 'non item' };
      const { body, status } = await agent.put(`${baseUrl}/items/${itemInDB + 1}`).send(testItem).ok(() => true);
      expect(status).to.equal(statusCode.BAD_REQUEST);
      expect(body).to.deep.equals({});
    });
  });

  describe('delete elements with DELETE services', async () => {
    let itemsInDB;
    beforeEach(async () => {
      await resetDB(baseUrl);
      itemsInDB = (await agent.post(`${baseUrl}/items/batch`).send(listOfItems)).body;
    });
    it('should have deleted all elements in DB', async () => {
      await Promise.all(itemsInDB.map((item) => agent.delete(`${baseUrl}/items/${item.id}`)));
      const { body: { length: itemsAmmount }, status } = await agent.get(`${baseUrl}/items`);
      expect(status).to.equal(statusCode.OK);
      expect(itemsAmmount).to.equal(0);
    });
    it('should give NOT FOUND error when trying to delete a non existing item', async () => {
      const nonExistingItemId = Math.max(...itemsInDB.map((item) => item.id)) + 1;
      const { body, status } = await agent.delete(`${baseUrl}/items/${nonExistingItemId}`).ok(() => true);
      expect(status).to.equal(statusCode.NOT_FOUND);
      expect(body).to.contains({ error: 'Not Found' });
    });
  });

  describe('update quality of the items with the POST service', async () => {
    beforeEach(async () => {
      await resetDB(baseUrl);
      await agent.post(`${baseUrl}/items/batch`).send(listOfItems);
    });
    it('should update the quality of all items properly', async () => {
      const { body: updatedItems, status } = await agent.post(`${baseUrl}/items/quality`);
      expect(status).to.equal(statusCode.OK);
      expect(updatedItems).to.be.jsonSchema(listOfItemsSchema);
      expect(updatedItems.map(({ id, ...it }) => it)).to.deep.equals(listOfItemsWithQualityUpdated);
    });
  });
});
