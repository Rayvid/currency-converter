const exceptions = require('../../exceptions');
const fetch = require('node-fetch');

module.exports = (config) => {
  return {
    getRate:
      async (currFrom, currTo) => {
        throw new exceptions.Exception({ message: 'Fixer cannot convert directly - only using EUR as base', statusCode: 400 });
      },
    getRateUsingEurAsBase:
      async (currFrom, currTo) => {
        let eurRates = {};
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

        try {
          if (eurRates.rates[currFrom.toUpperCase()] <= 0 && eurRates.rates[currTo.toUpperCase()] <= 0) {
            throw new Error('Cannot get actual rates');
          }
        } catch (err) {
          // All infra/logic errors will be sinked there, using custom exception class to preserve original error and stacktrace
          throw new exceptions.ModelException({ message: 'Conversion service cannot provide rates you requested for conversion', innerError: err });
        }

        return (1 / eurRates.rates[currFrom]) * eurRates.rates[currTo];
      },
  };
};
