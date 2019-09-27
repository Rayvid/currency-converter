const config = require('../../../config');
const model = require('../../model');

module.exports = (app) => {
  // To not even initialize db where its not needed, models are lazy, populated once per request by getModels
  app.use(async (req, res, next) => {
    res.locals.getModels = async () => {
      res.locals.getModels = async () => Promise.resolve(model(config));
      return res.locals.getModels();
    };

    next();
  });
};
