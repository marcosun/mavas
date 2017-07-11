FROM node:8

WORKDIR /app

ADD . /app

EXPOSE 80

CMD ["npm", "start"]