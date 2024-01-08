FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install -g prisma 
RUN npx prisma generate


COPY . .

CMD ["npm", "run", "start:dev"]
