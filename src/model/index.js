const currencyRate = require('./currencyRate');

module.exports = (config, ratesDbConnection) => currencyRate(config, ratesDbConnection);
