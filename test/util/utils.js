const agent = require('superagent');

const compareItems = (item1, item2) => item1.name === item2.name
  && item1.sellIn === item2.sellIn
  && item1.quality === item2.quality
  && item1.type === item2.type;

const deleteItemsFromDB = async (baseUrl, listToDelete) => {
  const { body: itemsInBd } = await agent.get(`${baseUrl}/items`);
  return Promise.all(
    itemsInBd.filter((item) => listToDelete.find((it) => compareItems(it, item)))
      .map((item) => agent.delete(`${baseUrl}/items/${item.id}`))
  );
};

// eslint-disable-next-line no-unused-vars
const resetDB = async (baseUrl) => {
  const { body: itemsInBd } = await agent.get(`${baseUrl}/items`);
  return Promise.all(
    itemsInBd.map((item) => agent.delete(`${baseUrl}/items/${item.id}`))
  );
};

exports.compareItems = compareItems;
exports.deleteItemsFromDB = deleteItemsFromDB;
exports.resetDB = resetDB;
