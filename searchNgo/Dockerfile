FROM node:20.10

WORKDIR /app

COPY package*.json /app
COPY src /app/src
COPY prisma /app/prisma
COPY tsconfig.json /app
COPY . /app

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]