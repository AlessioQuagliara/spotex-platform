import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Email, password e role sono obbligatori' });
    res.status(201).json({ success: true, data: await authService.register(email, password, name, role) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email e password sono obbligatori' });
    res.status(200).json({ success: true, data: await authService.login(email, password) });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token obbligatorio' });
    res.status(200).json({ success: true, data: await authService.verifyEmail(token) });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Il logout effettivo avviene lato client rimuovendo il token
    // Qui possiamo aggiungere eventuali operazioni di cleanup se necessarie
    res.status(200).json({ success: true, message: 'Logout effettuato con successo' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint di test per verificare automaticamente gli utenti (solo per testing)
export const verifyUserForTest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email obbligatoria' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true }
    });

    res.status(200).json({ success: true, message: 'Utente verificato per test' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint per richiedere reset password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email obbligatoria' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Per sicurezza, non riveliamo se l'email esiste o meno
      return res.status(200).json({ success: true, message: 'Se l\'email è registrata, riceverai le istruzioni per il reset della password' });
    }

    // Invalida eventuali token precedenti per questo utente
    await prisma.emailToken.updateMany({
      where: {
        email,
        type: 'PASSWORD_RESET',
        used: false
      },
      data: { used: true }
    });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.emailToken.create({
      data: {
        token: resetToken,
        email,
        type: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() + 3600000), // 1 ora
        userId: user.id,
      },
    });

    console.log(`🔑 Reset password: http://localhost:3004/reset-password?token=${resetToken}`);

    res.status(200).json({ success: true, message: 'Se l\'email è registrata, riceverai le istruzioni per il reset della password' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint per resettare la password con token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token e nuova password sono obbligatori' });

    const emailToken = await prisma.emailToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!emailToken || emailToken.used || emailToken.type !== 'PASSWORD_RESET' || emailToken.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token non valido o scaduto' });
    }

    // Aggiorna la password dell'utente
    await prisma.user.update({
      where: { id: emailToken.user!.id },
      data: {
        password: await bcrypt.hash(newPassword, 12),
        updatedAt: new Date()
      }
    });

    // Marca il token come usato
    await prisma.emailToken.update({
      where: { id: emailToken.id },
      data: { used: true }
    });

    res.status(200).json({ success: true, message: 'Password aggiornata con successo' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};