const exceptions = require('../../exceptions');
const fetch = require('node-fetch');
const schema = require('../schema');
const logger = require('../../util/logger')();

module.exports = (config, ratesDbConnection) => {
  return {
    getRate:
      async (currFrom, currTo) => {
        throw new exceptions.Exception({ message: 'Fixer cannot convert directly - only using EUR as base', statusCode: 400 });
      },
    getRateUsingEurAsBase:
      async (currFrom, currTo) => {
        let eurRates = { rates: await schema.rateSchema.getActiveSchema(ratesDbConnection).find().sort({ updatedAt: -1 }).lean() };
        if (!eurRates || eurRates.rates.length === 0 || eurRates.rates[0].updatedAt.getTime() < Date.now() - 10000 /* 10 sec */)
        {
          logger.info('Fetching newest rates');
          try {
            eurRates = await (await fetch(
              config.currencyConverter.templateFixerUrl.replace(
                '{access_key}',
                config.currencyConverter.fixerAccessKey))).json();

            if (eurRates && eurRates.error) {
              throw new Error(JSON.stringify(eurRates.error));
            }
          } catch (err) {
            // All infra/logic errors will be sinked there, using custom exception class to preserve original error and stacktrace
            throw new exceptions.ModelException({ message: 'Conversion service down, please try again later', innerError: err });
          }

          if (!eurRates || !eurRates.success || !eurRates.rates) {
            throw new exceptions.ModelException({ message: 'Conversion service down, please try again later' });
          }

          for (key in eurRates.rates) {
            await schema.rateSchema.getActiveSchema(ratesDbConnection)
              .findOneAndUpdate({
                currency: key,
              }, { currency: key, rate: eurRates.rates[key], updatedAt: Date.now() }, { upsert: true, useFindAndModify: false });
          }
        } else {
          logger.info('Rates cache is recent enough to reuse');
          for (key in eurRates.rates) {
            eurRates.rates[eurRates.rates[key].currency] = eurRates.rates[key].rate;
            delete eurRates.rates[key];
          }
        }

        try {
          if ((eurRates.rates[currFrom.toUpperCase()] || 0) <= 0 || (eurRates.rates[currTo.toUpperCase()] || 0) <= 0) {
            throw new Error('Cannot get actual rates');
          }
        } catch (err) {
          // All infra/logic errors will be sinked there, using custom exception class to preserve original error and stacktrace
          throw new exceptions.ModelException({ message: 'Conversion service cannot provide rates you requested for conversion', innerError: err });
        }

        return (1 / eurRates.rates[currFrom.toUpperCase()]) * eurRates.rates[currTo.toUpperCase()];
      },
  };
};
