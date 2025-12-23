import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/node_task',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwt',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
