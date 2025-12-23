-- Create Enums
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- Create User table
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'user',
  "status" "UserStatus" NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP(3)
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create Task table
CREATE TABLE "Task" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "TaskStatus" NOT NULL DEFAULT 'pending',
  "assigned_to" INTEGER NOT NULL,
  "created_by" INTEGER NOT NULL,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "Task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Task_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create TaskComment table
CREATE TABLE "TaskComment" (
  "id" SERIAL PRIMARY KEY,
  "task_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TaskComment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "TaskComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Indexes for quick filtering
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_assigned_to_idx" ON "Task"("assigned_to");
