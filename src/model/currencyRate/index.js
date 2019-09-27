const dataFixerIo = require('./dataFixerIo');

module.exports = config => ({
  dataFixerIo: dataFixerIo(config)
});
