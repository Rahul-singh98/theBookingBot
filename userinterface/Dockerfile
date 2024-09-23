FROM node:16.3.0-alpine AS prod

WORKDIR /app

COPY package.json /app

RUN npm install
RUN npm install -g serve

COPY . /app

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist"]