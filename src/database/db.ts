// const typeorm = require('typeorm');
import * as typeorm from 'typeorm';

class Post {
  constructor(
    public title: string,
    public price: string,
    public postURL: string,
    public postDate: string,
    public location: string,
    public image: string,
    public id?: string,
  ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.postURL = postURL;
    this.postDate = postDate;
    this.location = location;
    this.image = image;
  }
}

const EntitySchema = typeorm.EntitySchema;
const postSchema = new EntitySchema({
  name: 'Post',
  target: Post,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: 'varchar',
      nullable: true,
    },
    price: {
      type: 'varchar',
      nullable: true,
    },
    postURL: {
      type: 'text',
      nullable: true,
    },
    postDate: {
      type: 'text',
      nullable: true,
    },
    location: {
      type: 'text',
      nullable: true,
    },
    image: {
      type: 'text',
      nullable: true,
    },
  },
});

async function getConnection() {
  return await typeorm.createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: 5432,
    database: process.env.DATABASE,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: true,
    logging: false,
    entities: [postSchema],
  });
}

export async function getAllPosts() {
  const connection = await getConnection();
  const postRepo = connection.getRepository(Post);
  const posts = await postRepo.find();
  connection.close();
  return posts;
}

export async function checkForDuplicate(title: string) {
  const connection = await getConnection();
  const postRepo = await connection.getRepository(Post);

  if (await postRepo.findOne({ title })) {
    // tslint:disable-next-line: no-console
    console.log('This post exists, bub!');
    await connection.close();
    return true;
  } else {
    await connection.close();
    return false;
  }
}

export async function insertPost(
  title: string,
  price: string,
  postURL: string,
  postDate: string,
  location: string,
  image: string,
) {
  const connection = await getConnection();

  const post = new Post(
    (title = title),
    (price = price),
    (postURL = postURL),
    (postDate = postDate),
    (location = location),
    (image = image),
  );

  const postRepo = await connection.getRepository(Post);

  if (await postRepo.findOne({ title: post.title })) {
    // tslint:disable-next-line: no-console
    console.log('Post Already Exists!');
    const allPosts = await postRepo.find();
    await connection.close();
    return allPosts;
  }

  const res = await postRepo.save(post);
  // tslint:disable-next-line: no-console
  console.log('Saved', res);
  const allPosts = await postRepo.find();
  await connection.close();
  return allPosts;
}
