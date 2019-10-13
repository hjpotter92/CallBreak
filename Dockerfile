FROM node:alpine

LABEL maintainer="hjpotter92 <hjpotter92+github@gmail.com>"
WORKDIR /opt/app
ADD package.json package-lock.json ./
RUN npm i
COPY src ./src
COPY public ./public

CMD [ "npm", "start" ]
