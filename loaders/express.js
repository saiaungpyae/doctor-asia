import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'express-async-errors'; // no more try catch for async await

import config from '../config';
import setRoutes from '../routers';

export default () => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  setRoutes(app);

  app.use('*', (req, res) => {
    res.status(404).json({ message: '404' });
  });

  app.use((error, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = error;

    res.status(statusCode).json({ message });
  });

  return app;
};
