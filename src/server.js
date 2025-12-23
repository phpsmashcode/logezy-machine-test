import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { swaggerMiddleware } from './docs/swagger.js';
import { loggerMiddleware } from './utils/logger.js';
import './config/prisma.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use('/api-docs', ...swaggerMiddleware);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => res.json({ message: 'API is running' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
