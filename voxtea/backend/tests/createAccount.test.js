const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');
const upload = require('../routes/users/profilePicture/profilePictureUpload');
const createAccount = require('../routes/users/CreateAccount');

const app = express();
app.use(express.json());
app.use('/api/users', createAccount);

// Mock the User model
jest.mock('../models/User');

// Mock the jsonwebtoken library
jest.mock('jsonwebtoken');

// Mock the validator library
jest.mock('validator');

describe('User Registration Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const mockUser1 = {
      username: 'testuser',
      email: 'testuser@email.com',
      password: 'StrongPassword123!',
    };

    const mockFile = {
      fieldname: 'profilePicture',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1000,
      destination: '/uploads/',
      filename: 'test.png',
      path: '/uploads/test.png',
      buffer: Buffer.from('dummy image data'),
    };

    // Mock the return values for User.findOne and User.prototype.save
    User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    User.prototype.save.mockImplementationOnce(function () {
      this._id = 'mockUserId';
      return Promise.resolve(this);
    });
    
    jwt.sign.mockReturnValueOnce('mockToken');
    validator.isEmail.mockReturnValueOnce(true);

    const response = await request(app)
      .post('/api/users/register')
      .field('profilePicture', mockFile.buffer, mockFile.originalname)
      .field('username', mockUser1.username)
      .field('email', mockUser1.email)
      .field('password', mockUser1.password);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String) }),  // Check for String type id
      process.env.JWT_SECRET,
      expect.objectContaining({ expiresIn: '1h' })
    );
  });

  it('should return an error if the password is invalid', async () => {
    const mockUser2 = {
      username: 'testuser',
      email: 'testuser@email.com',
      password: 'weakpassword',
    };

    const mockFile = {
      fieldname: 'profilePicture',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1000,
      destination: '/uploads/',
      filename: 'test.png',
      path: '/uploads/test.png',
      buffer: Buffer.from('dummy image data'),
    };

    const response = await request(app)
      .post('/api/users/register')
      .field('profilePicture', mockFile.buffer, mockFile.originalname)
      .field('username', mockUser2.username)
      .field('email', mockUser2.email)
      .field('password', mockUser2.password);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return an error if the username is already registered', async () => {
    const mockUser3 = {
      username: 'existinguser',
      email: 'testuser@email.com',
      password: 'StrongPassword123!',
    };

    const mockFile = {
      fieldname: 'profilePicture',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1000,
      destination: '/uploads/',
      filename: 'test.png',
      path: '/uploads/test.png',
      buffer: Buffer.from('dummy image data'),
    };

    User.findOne.mockResolvedValueOnce({ username: 'existinguser' });

    const response = await request(app)
      .post('/api/users/register')
      .field('profilePicture', mockFile.buffer, mockFile.originalname)
      .field('username', mockUser3.username)
      .field('email', mockUser3.email)
      .field('password', mockUser3.password);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username is already registered.');
  });

  it('should return an error if the email is already registered', async () => {
    const mockUser4 = {
      username: 'uniqueuser',
      email: 'existing@email.com',
      password: 'StrongPassword123!',
    };
  
    const mockFile = {
      fieldname: 'profilePicture',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1000,
      destination: '/uploads/',
      filename: 'test.png',
      path: '/uploads/test.png',
      buffer: Buffer.from('dummy image data'),
    };

    validator.isEmail.mockReturnValueOnce(true);

    User.findOne.mockImplementation(async (query) => {
      if (query.username === 'uniqueuser') return null;
      if (query.email === 'existing@email.com') return { email: query.email };
    });
  
    const response = await request(app)
      .post('/api/users/register')
      .field('profilePicture', mockFile.buffer, mockFile.originalname)
      .field('username', mockUser4.username)
      .field('email', mockUser4.email)
      .field('password', mockUser4.password);
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is already registered.');
  });
  
});