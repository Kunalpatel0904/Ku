FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
