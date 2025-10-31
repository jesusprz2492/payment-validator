FROM node:18

RUN mkdir -p /home/app

WORKDIR /home/app

EXPOSE 80

CMD ["node","index.js"]