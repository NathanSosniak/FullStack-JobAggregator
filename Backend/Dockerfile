FROM node:25
WORKDIR /usr/local/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]