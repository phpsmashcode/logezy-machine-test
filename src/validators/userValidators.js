import { body, param, query } from 'express-validator';

export const listUsersValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const updateUserStatusValidation = [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('status').isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

export const deleteUserValidation = [
  param('id').isInt().withMessage('User ID must be an integer'),
];
