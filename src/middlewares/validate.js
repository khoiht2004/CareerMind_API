function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errorMessage = JSON.parse(result.error.message)[0].message;
      if (typeof res.error === 'function') {
        return res.error(422, errorMessage);
      }
      return res.error(422, { message: errorMessage });
    }
    req[source] = result.data;
    next();
  };
}

module.exports = validate;
