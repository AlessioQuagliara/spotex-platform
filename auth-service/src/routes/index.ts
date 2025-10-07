/**
 * @fileoverview Auth Service Routes
 * @principle KISS - Simple, focused auth endpoints
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

// ==================== AUTH ENDPOINTS ====================

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', asyncHandler(authController.login.bind(authController)));

/**
 * POST /api/auth/register
 * User registration (for agencies)
 */
router.post('/register', asyncHandler(authController.register.bind(authController)));

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));

/**
 * POST /api/auth/logout
 * Logout (invalidate refresh token)
 */
router.post('/logout', asyncHandler(authController.logout.bind(authController)));

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword.bind(authController)));

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', asyncHandler(authController.resetPassword.bind(authController)));

/**
 * POST /api/auth/verify-email
 * Verify email with token
 */
router.post('/verify-email', asyncHandler(authController.verifyEmail.bind(authController)));

/**
 * GET /api/auth/me
 * Get current user info (requires auth)
 */
router.get('/me', asyncHandler(authController.getMe.bind(authController)));

export default router;
