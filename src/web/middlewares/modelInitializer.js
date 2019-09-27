const config = require('../../../config');
const model = require('../../model');
const db = require('../../util/db');

module.exports = (app) => {
  // To not even initialize db where its not needed, models are lazy, populated once per request by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = async () => {
      res.locals.getModels = async () => Promise.resolve(model(config, await db.getConnection('Rates')));
      return res.locals.getModels();
    };

    next();
  });
};
