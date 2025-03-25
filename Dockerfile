FROM node:18-alpine

RUN mkdir -p /app/uploads/profile-images

WORKDIR /app

COPY package*.json ./
COPY .env.docker .env

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]