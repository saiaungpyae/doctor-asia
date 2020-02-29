import http from 'http';
import mongoose from 'mongoose';

import config from './config';
import setupExpress from './loaders/express';

const Console = console;

const { user, pass, dbName, dbPort, host } = config.db;
const mongooseOption = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user,
  pass
};
mongoose.connect(`mongodb://${host}:${dbPort}/${dbName}`, mongooseOption);
const db = mongoose.connection;

db.on('error', err => {
  Console.log('MONGOOSE ERR => ', err);
});

db.once('open', () => {
  Console.info('CONNECTED TO => ', config.db);
});

process.on('unhandledRejection', err => Console.error(err));

process.on('SIGINT', () => {
  db.close(() => {
    process.exit(0);
  });
});

const app = setupExpress();
const server = http.createServer(app);

server.listen(config.port, () => {
  Console.info('APPLICATION STARTED ON PORT => ', config.port);
});

export default server;
