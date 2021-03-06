const { logger: log } = require('../../util');
const expressWinston = require('express-winston');
const modelInitializer = require('./modelInitializer');
const bodyParser = require('body-parser');
const errorHandler = require('./error.js');
const notFoundHandler = require('./404.js');

module.exports = {
  beforeHandler: [
    app => app.use(expressWinston.logger(log)),
    app => app.use(bodyParser.json({ limit: '10mb' })),
    modelInitializer],
  notFound: notFoundHandler,
  errorSink: errorHandler,
};
