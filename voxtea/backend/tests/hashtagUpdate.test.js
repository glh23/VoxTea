const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/User');


const jwt_secret = '123';
let app, mongoServer, token, userId, hashtagRoutes;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app = express();
  app.use(express.json());
  process.env.JWT_SECRET = jwt_secret;
  const hashtagRoutes = require('../routes/users/hashtagUpdate');
  app.use('/api/hashtags', hashtagRoutes);
});

beforeEach(async () => {
  await User.deleteMany({});

  const user = new User({
    email: 'test@email.com',
    username: 'testuser',
    password: 'hashedPassword',
    interestedHashtags: ['#coding', '#nodejs'],
  });

  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, jwt_secret);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Hashtag Routes', () => {
  it('should get user hashtags', async () => {
    const res = await request(app)
      .get('/api/hashtags/get')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.hashtags).toContain('#coding');
  });

  it('should return 401 if no token is provided on GET', async () => {
    const res = await request(app).get('/api/hashtags/get');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'No token provided.');
  });

  it('should update user hashtags', async () => {
    const newTags = ['#javascript', '#backend'];
    const res = await request(app)
      .post('/api/hashtags/update')
      .set('Authorization', `Bearer ${token}`)  
      .send({ hashtags: newTags });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hashtags updated successfully.');

    const updatedUser = await User.findById(userId);
    expect(updatedUser.interestedHashtags).toEqual(newTags);
  });

  it('should delete a hashtag from user', async () => {
    // First update to add the hashtag to delete
    await User.findByIdAndUpdate(userId, { $set: { interestedHashtags: ['#javascript', '#backend'] } });

    const res = await request(app)
      .post('/api/hashtags/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({ hashtag: '#javascript' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hashtag removed.');

    const updatedUser = await User.findById(userId);
    expect(updatedUser.interestedHashtags).not.toContain('#javascript');
  });

  it('should return 401 if no token is provided on POST', async () => {
    const res = await request(app)
      .post('/api/hashtags/update')
      .send({ hashtags: ['#javascript', '#backend'] });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized.');
  });

  it('should return 400 if no hashtags are provided in update request', async () => {
    const res = await request(app)
      .post('/api/hashtags/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ hashtags: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Hashtags are required.');
  });


  it('should return empty hashtags array if no hashtags are set initially', async () => {
    await User.findByIdAndUpdate(userId, { $set: { interestedHashtags: [] } });

    const res = await request(app)
      .get('/api/hashtags/get')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.hashtags).toEqual([]);
  });

});




