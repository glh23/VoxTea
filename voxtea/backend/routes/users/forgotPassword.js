const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a reset token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send email with reset link
        const emailer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailThings = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://yourapp.com/reset-password/${token}`
        };

        await emailer.sendMail(mailThings);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email' });
    }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;
