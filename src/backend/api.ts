// Our API for demos only
import { db } from './db';
import * as os from 'os';

import * as express from 'express';


function cpus(req, res) {
  let data = os.cpus();
  res.json(data);

  // db.get()
  //   .then(data => {
  //     return data;
  //   })
  //   .then(data => res.json(data));
}


let api = express();
api.get('/cpus', cpus);
api.get('/mem', (req, res) =>
  res.json({
    free: os.freemem(),
    total: os.totalmem()
  }));


export function initApi(app) {
  app.use('/api', api)
}
