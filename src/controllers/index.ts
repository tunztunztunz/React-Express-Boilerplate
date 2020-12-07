import * as express from 'express';
import * as bodyParser from 'body-parser';
import { getAllPosts } from '../database/db';

const router = express.Router();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.use(bodyParser.json());

router.get('/hello', async (req, res) => {
  // tslint:disable-next-line: no-console
  console.log('This is the hello route.');
  res.send({ message: 'Hello!' });
});

router.get('/posts', async (req, res) => {
  const posts = await getAllPosts();
  // tslint:disable-next-line: no-console
  console.log('hit the route!');
  res.send(posts);
});

export = router;
