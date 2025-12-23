import prisma from '../config/prisma.js';

export const getProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });
};

export const listUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: { deletedAt: null } }),
  ]);
  return { users, total, page, limit, pages: Math.ceil(total / limit) };
};

export const updateUserStatus = async (userId, status) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });
};

export const softDeleteUser = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });
};
