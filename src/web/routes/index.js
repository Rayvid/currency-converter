const healthCheckRoutes = require('./healthcheck');
const versionCheck = require('./versionCheck');
const currencyConversion = require('./currencyConversion');

module.exports = {
  healthCheck: healthCheckRoutes.healthCheck,
  sentryPing: healthCheckRoutes.sentryPing,
  versionCheck,
  currencyConversion: currencyConversion,
};
