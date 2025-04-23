const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Post = require('../models/Post');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const jwt_secret = 'testsecret';
let app, mongoServer, token, userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  process.env.JWT_SECRET = jwt_secret;

  app = express();
  app.use(express.json());

  const deleteUserRoute = require('../routes/users/delete');
  app.use('/api', deleteUserRoute);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Message.deleteMany({});
  await Chat.deleteMany({});

  const user = new User({
    username: 'deleteMe',
    email: 'delete@email.com',
    password: 'FakePassword123!'
  });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, jwt_secret);

  await Post.create({
    userId,
    description: 'Post to delete',
    audioFile: 'http://example.com/audio.mp3', 
    likes: [userId]
  });
  
  const chat = await Chat.create({ participants: [userId] });

  await Message.create({
    sender: userId,
    chat: chat._id,
    text: 'Hi', 
  });
  

  const otherUser = new User({ username: 'follower', email: 'follower@email.com', password: 'FakePassword123!', following: [userId], followers: [userId] });
  await otherUser.save();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('DELETE /user', () => {
  it('should delete user and related data', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/);

    const user = await User.findById(userId);
    expect(user).toBeNull();

    const posts = await Post.find({ userId });
    expect(posts.length).toBe(0);

    const messages = await Message.find({ sender: userId });
    expect(messages.length).toBe(0);

    const chats = await Chat.find({ participants: userId });
    expect(chats.length).toBe(0);
  });

  it('should return 401 if token not provided', async () => {
    const res = await request(app).delete('/api/user');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided.');
  });

  it('should return 404 if user not found', async () => {
    const fakeToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, jwt_secret);
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${fakeToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
