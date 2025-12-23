import prisma from '../config/prisma.js';

export const createTask = async ({ title, description, assignedTo, createdBy }) => {
  return prisma.task.create({
    data: { title, description, assignedTo, createdBy },
    include: { assignee: { select: { id: true, name: true, email: true } }, creator: { select: { id: true, name: true, email: true } } },
  });
};

export const updateTask = async (taskId, data) =>
  prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      creator: { select: { id: true, name: true, email: true } },
    },
  });

export const listTasks = async ({ status, assignedTo, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const where = { deletedAt: null };
  if (status) where.status = status;
  if (assignedTo) where.assignedTo = assignedTo;
  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);
  return { tasks, total, page, limit, pages: Math.ceil(total / limit) };
};

export const findTaskById = (taskId) =>
  prisma.task.findUnique({ where: { id: taskId }, include: { assignee: true, creator: true } });

export const addComment = (taskId, userId, comment) =>
  prisma.taskComment.create({ data: { taskId, userId, comment }, include: { user: true } });

export const listComments = (taskId) =>
  prisma.taskComment.findMany({ where: { taskId }, include: { user: true }, orderBy: { createdAt: 'asc' } });
