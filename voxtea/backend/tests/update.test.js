const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('@node-rs/bcrypt');
const express = require('express');

const User = require('../models/User');

const jwt_secret = 'testsecret';
let app, mongoServer, token, user;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  process.env.JWT_SECRET = jwt_secret;

  const userRoutes = require('../routes/users/update');
  app.use('/api/users', userRoutes);
});

beforeEach(async () => {
  await User.deleteMany({});
  user = new User({
    email: 'user@email.com',
    username: 'testuser',
    password: 'ValidPass123!', 
  });
  await user.save();
  token = jwt.sign({ id: user._id }, jwt_secret); 
});


afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('User Settings - Update Username', () => {
  it('should successfully update username', async () => {
    const res = await request(app)
      .post('/api/users/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: user.email, newUsername: 'new_user123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Username updated successfully');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.username).toBe('new_user123');
  });

  it('should reject invalid usernames', async () => {
    const res = await request(app)
      .post('/api/users/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: user.email, newUsername: '!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Username/);
  });

  it('should reject username update with wrong email', async () => {
    const res = await request(app)
      .post('/api/users/username')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'wrong@email.com', newUsername: 'validName' });

    expect(res.status).toBe(401);
  });
});

describe('User Settings - Update Password', () => {
  it('should successfully update password', async () => {
    const res = await request(app)
      .post('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'ValidPass123!',
        newPassword: 'NewPassword456@'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password updated successfully');
  });

  it('should reject incorrect current password', async () => {
    const res = await request(app)
      .post('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'WrongPass!',
        newPassword: 'NewPassword456@'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Current password is incorrect');
  });

  it('should reject weak new password', async () => {
    const res = await request(app)
      .post('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'ValidPass123!',
        newPassword: 'short'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Password/);
  });
});

describe('Authorization Handling', () => {
  it('should return 401 if no token is provided (username)', async () => {
    const res = await request(app)
      .post('/api/users/username')
      .send({ email: user.email, newUsername: 'anotherName' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided.');
  });

  it('should return 401 if no token is provided (password)', async () => {
    const res = await request(app)
      .post('/api/users/password')
      .send({ currentPassword: 'ValidPass123!', newPassword: 'AnotherPass123!' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided.');
  });
});
