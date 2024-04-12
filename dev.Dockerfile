FROM node

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

ENV NODE_ENV=production

COPY . ./

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]