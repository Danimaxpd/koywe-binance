# Koywe-Binance

API to consume Binance P2P
[By Danimaxpd](https://github.com/Danimaxpd)

## Documentation

This project is designed to consume the Binance P2P [API](https://www.binance.com/en/binance-api) in order to solve the challenge by Koywe

> The objective of this technical task is to create a peer to peer (P2P) interaction bot for the Binance platform. The bot must be capable of buying and selling cryptocurrency on Binance's P2P marketplace, providing an automated and efficient experience for users.

### diagram flow:

![diagram flow Of the Koywe-Binance project](https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-wESijJsydhVVGk5-ZPUmGcJ0Rsj4cXkXKYsrI2QXuPychIe06R4Acxu-3gzkaMHsSuuZfGe0NdIsGx1IBjqZJWB9ctwA=w1920-h947)

[Image Link](https://drive.google.com/file/d/12_JT0PS0DPjygsLKLJRxWd0sHc5zM_17/view?usp=sharing)

### What it does:

The fastify project provides endpoints to connect to this system and consume the binance api also.

#### APIREST

**Trade endpoins** :

- _accountInfo_: Allow get the basic information of your account.
- _userTrades_: ?symbol=BNBUSDT depending of the symbol the endpoint will return the trades you did.
- _newOrder_: Main endpoint allow to set up the orders in binance platform
- _cancelOrder_: Enpoint that allow you cancel a trade,but depends of the state of the order.

#### WebSocket

**WebSocket endpoints** :

- _tradesStreamConnect_: An endpoint APIREST that execute internally a stream connection, the function logs all the trades in the console, this will be automatically close after a time.
- _cancelOrder_: An endpoint APIREST to force close the stream connection.
- _fetchHistoricalTrades_: An endpoint type WS, allow a connection to binance websocket to get historical trades, if you send a message it will return the last data from database.

### What are the dependencies

Fastify framework with these dependencies:

- [@binance/connector](https://github.com/binance/binance-connector-node): This is a lightweight library that works as a connector to Binance public API, written for Node.js users.
- [Prisma](https://www.prisma.io/fastify): Prisma is a next-generation ORM that's used to query your database in a Fastify server.
- _Fastify plugin's_:
  - [websocket](https://www.npmjs.com/package/@fastify/websocket): WebSocket support for Fastify. Built upon ws@8.
  - [sensible](https://www.npmjs.com/package/@fastify/sensible): useful utilities to your Fastify instance
  - [autoload](https://www.npmjs.com/package/@fastify/autoload): Convenience plugin for Fastify that loads all plugins found in a directory and automatically configures routes matching the folder structure.

## How to run the project in your Local Machine

- Requirements:
  - Node minimum version 18.15.0 LTS
  - NPM
  - A connection to Mysql

### Steps

1. Create a `.env` file base on `.env-example` and fill the global environments.
2. To run
   - In your console:
     - `npm i` Install all the dependencies
     - `npx prisma generate` Generate the required client to consume the DB
     - `npx prisma db push` Create or update the schema into the DB
     - `npm run dev` Run a nodejs server in the port configured in the `env` file

### `.ENV` documentation

- **APP**

  - _PORT_ Port to run the Fastify project
  - _NODE_ENV_ set up the node environment.

- **Database**

  - _DB_URL_ `mysql://admin:admin@localhost:3306/test_db` URL string to connect
  - _DB_PORT_ Database Port
  - _DATABASE_NAME_ Docker variable to set database Name
  - _DATABASE_USER_ Docker variable to set database User
  - _DATABASE_PASSWORD_ Docker variable to set database User password\

- **API Binance**
  - _BINANCE_API_KEY_ Access key to consume the Binance API
  - _BINANCE_SECRET_KEY_ Access key to consume the Binance API
  - _BINANCE_URL_DOMAIN_ URL to point sandbox or production environment

### Docker

To Start the with docker you only need to follow these steps:

- Create the `.env` file.
- Change the url database "whatever url" to db (like the service name from docker-compose)
- Run docker-compose with the following command `docker compose up -d --build`.
- run into docker app service terminal and run `npx prisma db push` to create or update the collections.

## Available Scripts

In the project directory, you can run:

### `npm run dev` | `npm run dev:start`

To start the app in dev mode.

### `npm start`

For production mode

### `npm run test`

Run the test cases made in Jest

### `npm run watch:ts` | `npm run build:ts`

Build and put watch mode to check changes in ts files and validate them
