const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('../models/User');
const Post = require('../models/Post');

const jwt_secret = 'testsecret';

let app, mongoServer, token, userId, postId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  process.env.JWT_SECRET = jwt_secret;

  app = express();
  app.use(express.json());
  const likeRoutes = require('../routes/posts/likePost');
  app.use('/api/likes', likeRoutes);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});

  const user = await User.create({
    username: 'liker',
    email: 'liker@email.com',
    password: 'FakePassword123!',
  });

  userId = user._id;
  token = jwt.sign({ id: userId }, jwt_secret);

  const post = await Post.create({
    userId,
    description: 'Post for like test',
    audioFile: 'locationOfAudio/audio.mp3',
    likes: [],
  });

  postId = post._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/likes/:postId', () => {
  it('should like a post', async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/liked/i);
    expect(res.body.likes).toContainEqual(userId.toString());
  });

  it('should unlike a post if already liked', async () => {
    // First like
    await request(app)
      .post(`/api/likes/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    // Then unlike
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/unliked/i);
    expect(res.body.likes).not.toContain(userId.toString());
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post(`/api/likes/${postId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/No token/i);
  });

  it('should return 404 if post is not found', async () => {
    const fakePostId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/likes/${fakePostId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it('should handle server errors gracefully', async () => {
    // Mocking the Post.findById method to simulate a DB error
    jest.spyOn(Post, 'findById').mockImplementationOnce(() => {
      throw new Error('Mock DB error');
    });

    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Server error/i);
  });
});
