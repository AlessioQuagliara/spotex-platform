import { Router } from 'express';
import { register, login, verifyEmail, me, logout, verifyUserForTest, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-user-test', verifyUserForTest); // Solo per testing
router.get('/me', authenticate, me);
router.post('/logout', logout);

export default router;
