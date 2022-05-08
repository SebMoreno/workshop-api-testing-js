const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });
  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get('https://httpbin.org/get').query(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });
  it('Consume HEAD Service', async () => {
    const parametersToValidate = [
      'content-type',
      'connection',
      'server',
      'access-control-allow-origin',
      'access-control-allow-credentials'
    ];
    const [headResponse, getResponse] = await Promise.all([
      agent.head('https://httpbin.org/get'),
      agent.get('https://httpbin.org/get')
    ]);
    expect(headResponse.status).to.equal(statusCode.OK);
    expect(getResponse.status).to.equal(statusCode.OK);
    parametersToValidate.every(
      (parameter) => expect(headResponse.header[parameter]).be.equals(getResponse.header[parameter])
    );
  });
  it('Consume PATCH Service', async () => {
    const testData = {
      name: 'John',
      age: '31',
      city: 'New York'
    };
    const response = await agent
      .patch('https://httpbin.org/patch')
      .send(testData);
    expect(response.status).to.equal(statusCode.OK);
    Object.entries(testData)
      .forEach(
        ([testDataKey, testDataValue]) => expect(response.body.json[testDataKey])
          .to.be.equals(testDataValue)
      );
  });
  it('Consume PUT Service', async () => {
    const testData = {
      id: '123',
      product: 'iPhone',
      price: '$999.99',
      quantity: '1'
    };
    const response = await agent
      .put('https://httpbin.org/put')
      .send(testData);
    expect(response.status).to.equal(statusCode.OK);
    Object.entries(testData)
      .forEach(
        ([testDataKey, testDataValue]) => expect(response.body.json[testDataKey])
          .to.be.equals(testDataValue)
      );
  });
  it('Consume DELETE Service', async () => {
    const testData = {
      product: 'Samsung',
      price: '$1,000.00',
      quantity: '8'
    };
    const response = await agent
      .delete('https://httpbin.org/delete')
      .send(testData);
    expect(response.status).to.equal(statusCode.OK);
    Object.entries(testData)
      .forEach(
        ([testDataKey, testDataValue]) => expect(response.body.json[testDataKey])
          .to.be.equals(testDataValue)
      );
  });
});
