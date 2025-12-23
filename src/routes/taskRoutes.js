import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { create, update, list, addTaskComment, listTaskComments } from '../controllers/taskController.js';
import {
  createTaskValidation,
  updateTaskValidation,
  listTasksValidation,
  commentValidation,
  commentListValidation,
} from '../validators/taskValidators.js';

const router = Router();

router.post('/', authenticate, createTaskValidation, create);
router.put('/:id', authenticate, updateTaskValidation, update);
router.get('/', authenticate, listTasksValidation, list);
router.post('/:id/comments', authenticate, commentValidation, addTaskComment);
router.get('/:id/comments', authenticate, commentListValidation, listTaskComments);

export default router;
