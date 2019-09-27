const dataFixerIo = require('./dataFixerIo');

module.exports = (config, ratesDbConnection) => ({
  dataFixerIo: dataFixerIo(config, ratesDbConnection)
});
