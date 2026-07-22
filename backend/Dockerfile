FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY backend/package*.json ./backend/

RUN npm ci --workspace=backend

COPY backend ./backend

WORKDIR /app/backend

EXPOSE 4000

CMD ["npm", "start"]