import { Router } from 'express';
import { me, list, updateStatus, softDelete } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { listUsersValidation, updateUserStatusValidation, deleteUserValidation } from '../validators/userValidators.js';

const router = Router();

router.get('/me', authenticate, me);
router.get('/', authenticate, authorize(['admin']), listUsersValidation, list);
router.put('/:id', authenticate, authorize(['admin']), updateUserStatusValidation, updateStatus);
router.delete('/:id', authenticate, authorize(['admin']), deleteUserValidation, softDelete);

export default router;
