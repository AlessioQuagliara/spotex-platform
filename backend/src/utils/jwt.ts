import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string, role: string): string => {
  const payload = { userId, email, role };
  const secret = process.env.JWT_SECRET as string;

  return (jwt.sign as any)(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET as string;
  
  return (jwt.verify as any)(token, secret);
};;
