import { body, validationResult } from "express-validator";
// user email/password validation rules
const registerValidationRules = () => {
    return [
        body("email")
        .normalizeEmail()
        .toLowerCase()
        .isEmail()
        .withMessage("Invalid email address"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 6 characters long"), // todo password policy
    ]
}

// function to perform validtaion
const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    //   get errors from express validator
    const extractedErrors = errors.array().map((err) => {
      return { param: err.param, msg: err.msg };
    });
  
    return res.status(422).json({
      errors: extractedErrors,
    });
  };

// Export the middleware function
export default {
  registerValidationRules,
  validateInputs,
};
