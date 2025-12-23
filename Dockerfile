FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/node_task
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
