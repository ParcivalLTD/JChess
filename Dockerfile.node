FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY backend ./backend
COPY www ./www

CMD ["node", "backend/index.js"]
