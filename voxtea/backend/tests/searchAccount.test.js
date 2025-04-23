const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const User = require('../models/User');

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  const searchRoutes = require('../routes/users/searchAccounts');
  app.use('/api/search', searchRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});

  await User.create([
    { username: 'Alice123', email: 'a@email.com', password: 'Password1!', clout: 50 },
    { username: 'alice_wonder', email: 'b@email.com', password: 'Password2!', clout: 100 },
    { username: 'bob', email: 'c@email.com', password: 'Password3!', clout: 75 },
    { username: 'charlie', email: 'd@email.com', password: 'Password4!', clout: 10 }
  ]);
});

describe('GET /api/search', () => {
  it('should return matching users sorted by clout descending', async () => {
    const res = await request(app).get('/api/search').query({ query: 'alice' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].username).toBe('alice_wonder'); // clout 100
    expect(res.body[1].username).toBe('Alice123');     // clout 50
  });

  it('should be case-insensitive', async () => {
    const res = await request(app).get('/api/search').query({ query: 'ALICE' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should return 400 if no query provided', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Query parameter is required/);
  });

  it('should return an empty array if no users match', async () => {
    const res = await request(app).get('/api/search').query({ query: 'nonexistent' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
