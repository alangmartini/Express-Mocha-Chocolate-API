FROM node:14

WORKDIR /app/

COPY ./* ./

RUN npm init -y

RUN npm install express@4.17.1 --save-exact

RUN npm i eslint@6.8.0 eslint-config-trybe-backend@1.0.1 --save-dev --save-exact
