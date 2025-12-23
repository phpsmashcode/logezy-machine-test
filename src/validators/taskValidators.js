import { body, param, query } from 'express-validator';

export const createTaskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignedTo').isInt().withMessage('assignedTo must be a user id'),
];

export const updateTaskValidation = [
  param('id').isInt().withMessage('Task ID must be an integer'),
  body('title').optional().notEmpty(),
  body('description').optional().notEmpty(),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']),
  body('assignedTo').optional().isInt(),
];

export const listTasksValidation = [
  query('status').optional().isIn(['pending', 'in_progress', 'completed']),
  query('assignedTo').optional().isInt(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const commentValidation = [
  param('id').isInt().withMessage('Task ID must be an integer'),
  body('comment').notEmpty().withMessage('Comment is required'),
];

export const commentListValidation = [
  param('id').isInt().withMessage('Task ID must be an integer'),
];
