import 'reflect-metadata';
import 'express-async-errors';
import express, { Application, json } from 'express';
import { routes } from './routers';
import { handleErrors } from './middlewares/handleErros.middleware';

const app:Application = express();

app.use(json());

app.use('/', routes);

app.use(handleErrors)

export default app;

