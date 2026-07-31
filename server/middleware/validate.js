/**
 * Validates req.body against Zod schema
 * On success: replaces req.body with parsed (sanitized) data
 * On failure: returns 400 with field-level errors
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data; // sanitized + typed values
  next();
};

/**
 * Validates route params (e.g. :id) against Zod schema
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid parameters",
      details: result.error.flatten().fieldErrors,
    });
  }
  req.params = result.data;
  next();
};
