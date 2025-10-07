/**
 * @fileoverview Auth Controller - Business logic for authentication
 * @principle KISS - Simple, focused auth operations
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  User,
  UserRole,
  RolePermissions,
  ServiceResponse,
  createLogger,
  generateRandomString,
  isValidEmail,
  isStrongPassword,
  getPrismaClient,
} from '@spotex/shared';

const logger = createLogger('auth-controller');
const prisma = getPrismaClient();

export class AuthController {
  /**
   * User login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDto = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Email and password are required'));
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Invalid email format'));
        return;
      }

      // Find user (placeholder - would use UserService)
      const user = await this.findUserByEmail(email);
      if (!user) {
        res.status(401).json(ServiceResponse.error('INVALID_CREDENTIALS', 'Invalid email or password'));
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json(ServiceResponse.error('INVALID_CREDENTIALS', 'Invalid email or password'));
        return;
      }

      // Check if user is active
      if (user.status !== 'active') {
        res.status(401).json(ServiceResponse.error('ACCOUNT_INACTIVE', 'Account is not active'));
        return;
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Update last login
      await this.updateLastLogin(user.id);

      // Log successful login
      logger.info('User logged in', { userId: user.id, email: user.email });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          tenant_id: user.tenant_id,
          avatar: user.avatar,
        },
        token: tokens.accessToken,
        expiresAt: tokens.accessTokenExpiresAt,
      };

      res.json(ServiceResponse.success(response));
    } catch (error) {
      logger.error('Login error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Login failed'));
    }
  }

  /**
   * User registration
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterDto = req.body;

      // Validate input
      if (!data.email || !data.password || !data.first_name || !data.last_name) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'All fields are required'));
        return;
      }

      if (!isValidEmail(data.email)) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Invalid email format'));
        return;
      }

      const passwordValidation = isStrongPassword(data.password);
      if (!passwordValidation.valid) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', passwordValidation.errors.join(', ')));
        return;
      }

      // Check if user already exists
      const existingUser = await this.findUserByEmail(data.email);
      if (existingUser) {
        res.status(409).json(ServiceResponse.error('USER_EXISTS', 'User already exists'));
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, parseInt(process.env.BCRYPT_ROUNDS || '10'));

      // Create user (placeholder - would use UserService)
      const user = await this.createUser({
        ...data,
        password_hash: passwordHash,
        role: 'agency_admin', // Default role for registration
        status: 'active',
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Log successful registration
      logger.info('User registered', { userId: user.id, email: user.email });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          tenant_id: user.tenant_id,
          avatar: user.avatar,
        },
        token: tokens.accessToken,
        expiresAt: tokens.accessTokenExpiresAt,
      };

      res.status(201).json(ServiceResponse.success(response));
    } catch (error) {
      logger.error('Registration error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Registration failed'));
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenDto = req.body;

      if (!refreshToken) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Refresh token is required'));
        return;
      }

      // Verify refresh token (placeholder - would check against stored tokens)
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;

      // Find user
      const user = await this.findUserById(decoded.userId);
      if (!user) {
        res.status(401).json(ServiceResponse.error('INVALID_TOKEN', 'Invalid refresh token'));
        return;
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      res.json(ServiceResponse.success({
        token: tokens.accessToken,
        expiresAt: tokens.accessTokenExpiresAt,
      }));
    } catch (error) {
      logger.error('Token refresh error', error);
      res.status(401).json(ServiceResponse.error('INVALID_TOKEN', 'Token refresh failed'));
    }
  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response): Promise<void> {
    // In a real implementation, you would invalidate the refresh token
    // For now, just return success
    res.json(ServiceResponse.success({ message: 'Logged out successfully' }));
  }

  /**
   * Request password reset
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email || !isValidEmail(email)) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Valid email is required'));
        return;
      }

      // Find user
      const user = await this.findUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        res.json(ServiceResponse.success({ message: 'If the email exists, a reset link has been sent' }));
        return;
      }

      // Generate reset token
      const resetToken = generateRandomString(32);
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token (placeholder)
      await this.storePasswordResetToken(user.id, resetToken, resetExpires);

      // Send email (placeholder - would use notification service)
      logger.info('Password reset requested', { userId: user.id, email: user.email });

      res.json(ServiceResponse.success({ message: 'If the email exists, a reset link has been sent' }));
    } catch (error) {
      logger.error('Forgot password error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Password reset request failed'));
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Token and new password are required'));
        return;
      }

      const passwordValidation = isStrongPassword(newPassword);
      if (!passwordValidation.valid) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', passwordValidation.errors.join(', ')));
        return;
      }

      // Verify reset token (placeholder)
      const userId = await this.verifyPasswordResetToken(token);
      if (!userId) {
        res.status(400).json(ServiceResponse.error('INVALID_TOKEN', 'Invalid or expired reset token'));
        return;
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '10'));

      // Update user password
      await this.updateUserPassword(userId, passwordHash);

      // Clear reset token
      await this.clearPasswordResetToken(userId);

      logger.info('Password reset successful', { userId });

      res.json(ServiceResponse.success({ message: 'Password reset successfully' }));
    } catch (error) {
      logger.error('Reset password error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Password reset failed'));
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json(ServiceResponse.error('VALIDATION_ERROR', 'Verification token is required'));
        return;
      }

      // Verify email token (placeholder)
      const userId = await this.verifyEmailToken(token);
      if (!userId) {
        res.status(400).json(ServiceResponse.error('INVALID_TOKEN', 'Invalid or expired verification token'));
        return;
      }

      // Update user status to active
      await this.activateUser(userId);

      logger.info('Email verified', { userId });

      res.json(ServiceResponse.success({ message: 'Email verified successfully' }));
    } catch (error) {
      logger.error('Email verification error', error);
      res.status(500).json(ServiceResponse.error('INTERNAL_ERROR', 'Email verification failed'));
    }
  }

  /**
   * Get current user info
   */
  async getMe(req: Request, res: Response): Promise<void> {
    // This would require auth middleware to set req.user
    // For now, return placeholder
    res.json(ServiceResponse.success({ message: 'Current user info' }));
  }

  // ==================== PRIVATE HELPER METHODS - KISS ====================

  private async findUserByEmail(email: string): Promise<any | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
        include: { tenant: true },
      });
      return user;
    } catch (error) {
      logger.error('Error finding user by email', error);
      return null;
    }
  }

  private async findUserById(id: string): Promise<any | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { tenant: true },
      });
      return user;
    } catch (error) {
      logger.error('Error finding user by id', error);
      return null;
    }
  }

  private async createUser(data: any): Promise<any> {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.password_hash,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role,
          tenantId: data.tenant_id,
          status: 'active',
        },
        include: { tenant: true },
      });
      return user;
    } catch (error) {
      logger.error('Error creating user', error);
      throw error;
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const secret = process.env.JWT_SECRET || 'default-secret';
    const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    const accessTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    return {
      accessToken,
      accessTokenExpiresAt,
    };
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      });
    } catch (error) {
      logger.error('Error updating last login', error);
    }
  }

  private async storePasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    // Placeholder - would store in database
  }

  private async verifyPasswordResetToken(token: string): Promise<string | null> {
    // Placeholder - would verify against database
    return null;
  }

  private async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    // Placeholder - would update user password
  }

  private async clearPasswordResetToken(userId: string): Promise<void> {
    // Placeholder - would clear reset token
  }

  private async verifyEmailToken(token: string): Promise<string | null> {
    // Placeholder - would verify email token
    return null;
  }

  private async activateUser(userId: string): Promise<void> {
    // Placeholder - would update user status to active
  }
}
