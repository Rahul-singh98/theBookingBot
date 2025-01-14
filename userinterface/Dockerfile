FROM node:22.3.0-alpine AS prod

WORKDIR /app

COPY package.json /app

RUN npm install
RUN npm install -g serve

COPY . /app
# COPY .prod.env /app/.env

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist"]