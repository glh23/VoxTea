const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const express = require('express');

const Post = require('../models/Post');
const User = require('../models/User');

const jwt_secret = 'testsecret';
let app, mongoServer, token, userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app = express();
  app.use(express.json());
  process.env.JWT_SECRET = jwt_secret;

  const postRoutes = require('../routes/posts/getPosts');
  app.use('/api/posts', postRoutes);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});

  const user = new User({
    email: 'user@email.com',
    username: 'testuser',
    password: 'hashedPassword',
    interestedHashtags: ['#javascript', '#music'],
  });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, jwt_secret);

  const recentPost = new Post({
    userId,
    description: 'Recent post description',
    audioFile: 'http://example.com/recent.mp3',
    hashtags: ['#javascript'],
    likes: [],
    createdAt: new Date(),
  });
  
  const oldPost = new Post({
    userId,
    description: 'Old post description',
    audioFile: 'http://example.com/old.mp3',
    hashtags: ['#oldtag'],
    likes: [],
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
  });
  
  const likedPost = new Post({
    userId,
    description: 'Liked post description',
    audioFile: 'http://example.com/liked.mp3',
    hashtags: ['#music'],
    likes: [userId],
    createdAt: new Date(),
  });
  

  await Promise.all([recentPost.save(), oldPost.save(), likedPost.save()]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Post Det', () => {

  // GET /recent
  it('should return posts from the last 28 days', async () => {
    const res = await request(app)
      .get('/api/posts/recent')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBeGreaterThan(0);
    expect(new Date(res.body.posts[0].createdAt)).toBeInstanceOf(Date);
  });

  it('should return 401 if no token is provided (recent)', async () => {
    const res = await request(app).get('/api/posts/recent');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided.');
  });

  // GET /hashtags
  it('should return posts with user-matching hashtags (last 56 days)', async () => {
    const res = await request(app)
      .get('/api/posts/hashtags')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBeGreaterThan(0);
    const tags = res.body.posts.flatMap(post => post.hashtags);
    expect(tags).toContain('#javascript');
    expect(tags).toContain('#music');
  });

  it('should return 401 if no token is provided (hashtags)', async () => {
    const res = await request(app).get('/api/posts/hashtags');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided.');
  });

  // GET /top
  it('should return top 100 posts sorted by likes', async () => {
    const res = await request(app)
      .get('/api/posts/top');

    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBeGreaterThan(0);
    expect(res.body.posts[0].likes.length).toBeGreaterThanOrEqual(
      res.body.posts[res.body.posts.length - 1].likes.length
    );
  });

  it('should return 404 if no posts exist in top route', async () => {
    await Post.deleteMany({});
    const res = await request(app).get('/api/posts/top');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('No posts found.');
  });
});
