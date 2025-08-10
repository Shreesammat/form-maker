const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;  // Replace req.body with validated data
    next();
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
  }
};

export default validate