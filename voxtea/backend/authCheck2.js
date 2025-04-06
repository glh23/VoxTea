const express = require('express');
const bcrypt = require('@node-rs/bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const verifyToken = require('./authCheck'); 

const pizza = express.Router();

// Defining the / authCheck route
pizza.post('/', verifyToken, async (req, res) => {
  try {
    // Decoded JWT data if the token is valid
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Unauthorized' });
    }

    res.status(200).json({ message: 'Authenticated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = pizza;