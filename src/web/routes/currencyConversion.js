module.exports = async (req, res) => {
  // TODO validation
  let rate = await (await res.locals.getModels())
    .dataFixerIo
    .getRateUsingEurAsBase(req.query.required_currency_code, req.query.paying_currency_code);

  res.status(200).json(
    {
      "paying_currency_code": req.query.paying_currency_code,
      "ammount": Number(req.query.ammount) * rate,
    });
};
