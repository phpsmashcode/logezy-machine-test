import {
  addComment,
  createTask,
  findTaskById,
  listComments,
  listTasks,
  updateTask,
} from '../services/taskService.js';
import { handleValidation } from '../utils/validation.js';
import prisma from '../config/prisma.js';

export const create = [
  handleValidation,
  async (req, res) => {
    try {
      const assignee = await prisma.user.findFirst({
        where: { id: req.body.assignedTo, deletedAt: null, status: 'active' },
      });
      if (!assignee) {
        return res.status(400).json({ message: 'Assigned user not found or inactive' });
      }
      const task = await createTask({ ...req.body, createdBy: req.user.id });
      res.status(201).json({ message: 'Task created', task });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const update = [
  handleValidation,
  async (req, res) => {
    try {
      const taskId = Number(req.params.id);
      const existing = await findTaskById(taskId);
      if (!existing || existing.deletedAt) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (existing.status === 'completed') {
        return res.status(400).json({ message: 'Completed tasks cannot be edited' });
      }
      if (req.body.status === 'completed' && existing.assignedTo !== req.user.id) {
        return res.status(403).json({ message: 'Only assigned user can complete task' });
      }
      if (req.body.assignedTo) {
        const assignee = await prisma.user.findFirst({
          where: { id: req.body.assignedTo, deletedAt: null, status: 'active' },
        });
        if (!assignee) {
          return res.status(400).json({ message: 'Assigned user not found or inactive' });
        }
      }
      const task = await updateTask(taskId, {
        ...req.body,
        ...(req.body.status === 'completed' ? { completedAt: new Date() } : {}),
      });
      res.json({ message: 'Task updated', task });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const list = [
  handleValidation,
  async (req, res) => {
    const { status, assignedTo, page = 1, limit = 10 } = req.query;
    const data = await listTasks({
      status,
      assignedTo: assignedTo ? Number(assignedTo) : undefined,
      page: Number(page),
      limit: Number(limit),
    });
    res.json(data);
  },
];

export const addTaskComment = [
  handleValidation,
  async (req, res) => {
    try {
      const taskId = Number(req.params.id);
      const existing = await findTaskById(taskId);
      if (!existing || existing.deletedAt) {
        return res.status(404).json({ message: 'Task not found' });
      }
      const comment = await addComment(taskId, req.user.id, req.body.comment);
      res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const listTaskComments = [
  handleValidation,
  async (req, res) => {
    const taskId = Number(req.params.id);
    const existing = await findTaskById(taskId);
    if (!existing || existing.deletedAt) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const comments = await listComments(taskId);
    res.json(comments);
  },
];
