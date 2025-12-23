import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { config } from '../config/env.js';

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password, role = 'user' }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.deletedAt || user.status !== 'active') {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
  };
};
