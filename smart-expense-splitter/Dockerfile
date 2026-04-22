FROM node:18-alpine

WORKDIR /app

COPY smart-expense-splitter/ ./

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]