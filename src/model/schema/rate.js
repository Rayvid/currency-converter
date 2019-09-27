const { Schema } = require('mongoose');

const schema = new Schema(
  {
    currency: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'rates' },
);

module.exports = {
  schema,
  // TODO wrap mongoose model with our own,
  // to include more extensive logging, compatible Exceptions, etc
  getActiveSchema: connection => connection.model('rates', schema),
};
