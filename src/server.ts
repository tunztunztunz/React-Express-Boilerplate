import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import router = require('./controllers/index');
import path = require('path');

dotenv.config();
const app: express.Application = express();

interface Error {
  status?: number;
}

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(
  express.static('build', {
    setHeaders: (res) =>
      res?.req?.path?.split('/')[1] === 'static' &&
      res.setHeader('Cache-Control', 'max-age=31536000'),
  }),
);

// tslint:disable-next-line: no-var-requires
app.use('/api', router);

if (process.env.NODE_ENV !== 'production') {
  app.get('*', (req, res) => {
    res.send('In development mode');
  });
} else {
  const dir = path.join(__dirname, './public/react/frontend/');
  app.set('views', dir);
  app.use(express.static(dir));

  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: dir });
  });
}

// app.get('/*', (req, res) => {
//   return res.sendFile(__dirname + '/../build/public/react/frontend/index.html', (err: Error) =>
//     err.status === 404
//       ? res
//           .status(404)
//           .send(
//             '<b>Error: </b>Seems like there is currently no build present for this project. Please run <code>npm run build</code> and restart the server in order to continue. Thank you.',
//           )
//       : res.status(500).send('Internal Server Error'),
//   );
// });

app.listen(process.env.PORT || 5000, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is listening on port ${process.env.PORT || 5000}`),
);
