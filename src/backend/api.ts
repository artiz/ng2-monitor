// Our API for demos only
import { db } from './db';
import * as express from 'express';
import { SystemService } from './services/system';

let api = express();
api.get('/history', (req, res) =>
  res.json(SystemService.history)
);

export function initApi(app) {
  app.use('/api', api)
}
