import { getProfile, listUsers, updateUserStatus, softDeleteUser } from '../services/userService.js';
import { handleValidation } from '../utils/validation.js';
import prisma from '../config/prisma.js';

export const me = async (req, res) => {
  const user = await getProfile(req.user.id);
  res.json(user);
};

export const list = [
  handleValidation,
  async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const data = await listUsers({ page: Number(page), limit: Number(limit) });
    res.json(data);
  },
];

export const updateStatus = [
  handleValidation,
  async (req, res) => {
    try {
      const target = await prisma.user.findFirst({ where: { id: Number(req.params.id), deletedAt: null } });
      if (!target) return res.status(404).json({ message: 'User not found' });
      const user = await updateUserStatus(Number(req.params.id), req.body.status);
      res.json({ message: 'User status updated', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const softDelete = [
  handleValidation,
  async (req, res) => {
    try {
      const target = await prisma.user.findFirst({ where: { id: Number(req.params.id), deletedAt: null } });
      if (!target) return res.status(404).json({ message: 'User not found' });
      const user = await softDeleteUser(Number(req.params.id));
      res.json({ message: 'User deleted', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
