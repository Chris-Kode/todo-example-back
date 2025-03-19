FROM node:20-alpine

ENV NODE_ENV=production

USER node
RUN mkdir -p /home/node/app

WORKDIR /home/node/app
COPY --chown=node:node package.json .   

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

RUN npm run build

CMD ["node", "dist/main.js"]
