module.exports = async (req, res) => {
  // required_currency_code
  // ammount
  // paying_currency_code
  // {"paying_currency_code": "USD", "ammount": 450}
  // validation!!!
  res.status(200).json({ rate: await (await res.locals.getModels()).dataFixerIo.getRateUsingEurAsBase('EUR', 'USD') });
};
