const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => err.msg),
    });
  }
  next();
};

const knownProviders = {
  gmail:   ['gmail.com', 'gmail.co.uk'],
  yahoo:   ['yahoo.com', 'yahoo.co.uk', 'yahoo.in', 'yahoo.co.in'],
  hotmail: ['hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.in'],
  outlook: ['outlook.com', 'outlook.in', 'outlook.co.uk'],
  icloud:  ['icloud.com'],
  live:    ['live.com', 'live.co.uk', 'live.in'],
  proton:  ['proton.me', 'protonmail.com'],
  zoho:    ['zoho.com'],
};

const validateEmailDomain = (email) => {
  // Normalised email (after normalizeEmail is applied, it will be lowercase)
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) throw new Error('Invalid email address');
  const providerName = domain.split('.')[0];
  if (knownProviders[providerName]) {
    if (!knownProviders[providerName].includes(domain)) {
      const suggestion = knownProviders[providerName][0];
      throw new Error(`Invalid email. Did you mean @${suggestion}?`);
    }
  }
  return true;
};

const userRegisterValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail({ require_tld: true, allow_utf8_local_part: false }).withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom(validateEmailDomain),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  validate,
];

const userLoginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const taskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority'),
  validate,
];

module.exports = {
  userRegisterValidation,
  userLoginValidation,
  taskValidation,
};
