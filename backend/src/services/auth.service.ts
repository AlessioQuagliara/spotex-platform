import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';

export class AuthService {
  async register(email: string, password: string, name: string, role: 'AGENCY' | 'COMPANY') {
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new Error('Email già registrata');
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 12),
        name,
        role,
        verified: false,
      },
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.emailToken.create({
      data: {
        token: verificationToken,
        email,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 86400000),
        userId: user.id,
      },
    });

    console.log(`📧 Verifica email: http://localhost:3004/verify-email?token=${verificationToken}`);

    return { message: 'Controlla la tua email per verificare l\'account' };
  }

  async verifyEmail(token: string) {
    const emailToken = await prisma.emailToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!emailToken || emailToken.used || emailToken.expiresAt < new Date()) {
      throw new Error('Token non valido');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: emailToken.userId! },
        data: { verified: true },
      }),
      prisma.emailToken.update({
        where: { id: emailToken.id },
        data: { used: true },
      }),
    ]);

    const jwtToken = generateToken(emailToken.user!.id, emailToken.user!.email, emailToken.user!.role);

    return {
      user: {
        id: emailToken.user!.id,
        email: emailToken.user!.email,
        name: emailToken.user!.name,
        role: emailToken.user!.role,
      },
      token: jwtToken,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password)) || !user.verified) {
      throw new Error('Credenziali non valide');
    }

    const token = generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}