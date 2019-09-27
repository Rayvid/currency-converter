const config = require('config');
const joi = require('joi');
const server = require('./schema/server');
const logger = require('./schema/logger');
const mongo = require('./schema/mongo');
const currencyConverter = require('./schema/currencyConverter');

module.exports = {
  db: config.get('db'),
  server: joi.attempt(config.get('server'), server),
  logger: joi.attempt(config.get('logger'), logger),
  sentry: config.get('sentry'),
  mongo: joi.attempt(config.get('db.mongo'), mongo),
  currencyConverter: joi.attempt(config.get('currencyConverter'), currencyConverter),
};
