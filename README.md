# Task & User Management API

REST API built with Express, Prisma, JWT authentication, and Postgres. Covers two modules:

- **User Management**: registration, login, profile, admin user listing, status updates, and soft deletion.
- **Task Management**: task CRUD with assignment and completion rules plus task comments.

Swagger is available at `/api-docs`, and a Postman collection is included under `docs/`.

## Prerequisites

- Node.js 20+
- Docker + Docker Compose (for containerized setup)
- PostgreSQL 15+ (if running locally without Docker)

## Environment

Create a `.env` file based on `.env.example`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/node_task
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

## Quick Start (Docker - Recommended)

Build and run with Docker Compose (includes Postgres):

```bash
docker-compose up --build
```

This will:
- Start Postgres on port 5432
- Run migrations via `npm run prisma:migrate`
- Start the API on port 3000

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/api-docs`.

## Installation (Without Docker)

```bash
npm install
```

> If you encounter registry/network restrictions, configure your npm registry accordingly before installing (e.g., `npm config set registry https://registry.npmjs.org`).

Generate the Prisma client(You can ignore this step, migration already created):

```bash
npx prisma generate
```

Apply migrations to create the database schema:

```bash
npx prisma migrate deploy
```

## Running the app locally

```bash
npm run dev
```

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/api-docs`.


## API Overview

### Auth
- `POST /auth/register` — Register a user (hashed password, unique email)
- `POST /auth/login` — Authenticate and receive a 1-hour JWT token

### Users
- `GET /users/me` — Current user profile (requires JWT)
- `GET /users` — List users with pagination (admin only)
- `PUT /users/:id` — Update user status (admin only)
- `DELETE /users/:id` — Soft-delete user (admin only)

### Tasks
- `POST /tasks` — Create a task assigned to a user
- `PUT /tasks/:id` — Update task (completion only by assignee; completed tasks cannot be edited)
- `GET /tasks` — List tasks with filters and pagination
- `POST /tasks/:id/comments` — Add a comment to a task
- `GET /tasks/:id/comments` — List comments for a task

## Postman collection

Import `docs/TaskUserAPI.postman_collection.json` for ready-made requests covering authentication, users, tasks, and comments.

## Notes

- Prisma schema and an initial migration are stored in `prisma/`.
- Default Docker Compose credentials are `postgres/postgres`; adjust as needed in `.env` and `docker-compose.yml`.
- Module selection: implemented **User Management** and **Task Management** per requirements.
