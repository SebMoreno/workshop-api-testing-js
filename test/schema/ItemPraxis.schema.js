const itemPraxisSchema = {
  title: 'Item from praxis schema',
  type: 'object',
  properties: {
    id: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    sellIn: {
      type: 'number'
    },
    quality: {
      type: 'number'
    },
    type: {
      type: 'string'
    }
  }
};

exports.itemPraxisSchema = itemPraxisSchema;
