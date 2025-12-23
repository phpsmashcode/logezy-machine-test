import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task & User Management API',
    version: '1.0.0',
    description: 'User management with JWT auth plus task management with comments.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'user'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
          assignedTo: { type: 'integer' },
          createdBy: { type: 'integer' },
          completedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TaskComment: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          taskId: { type: 'integer' },
          userId: { type: 'integer' },
          comment: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['admin', 'user'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          409: { description: 'Email already in use' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/users/me': {
      get: {
        summary: 'Fetch authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
      },
    },
    '/users': {
      get: {
        summary: 'List users (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Users' } },
      },
    },
    '/users/{id}': {
      put: {
        summary: 'Update user status (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['active', 'inactive'] } } } },
          },
        },
        responses: { 200: { description: 'Updated user' } },
      },
      delete: {
        summary: 'Soft delete user (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'User deleted' } },
      },
    },
    '/tasks': {
      post: {
        summary: 'Create task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'assignedTo'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  assignedTo: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Task created' } },
      },
      get: {
        summary: 'List tasks',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['pending', 'in_progress', 'completed'] } },
          { in: 'query', name: 'assignedTo', schema: { type: 'integer' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        ],
        responses: { 200: { description: 'Tasks' } },
      },
    },
    '/tasks/{id}': {
      put: {
        summary: 'Update task',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                  assignedTo: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Updated task' } },
      },
    },
    '/tasks/{id}/comments': {
      post: {
        summary: 'Add comment to task',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { comment: { type: 'string' } } } } },
        },
        responses: { 201: { description: 'Comment added' } },
      },
      get: {
        summary: 'List task comments',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Comments' } },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerMiddleware = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)];
