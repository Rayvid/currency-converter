const joi = require('joi');

module.exports = joi.object({
  templateFixerUrl: joi.string().required(),
  fixerAccessKey: joi.string().required(),
}).unknown().required();
