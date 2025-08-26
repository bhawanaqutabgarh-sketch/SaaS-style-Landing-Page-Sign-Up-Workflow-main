const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/mailer');

const SALT_ROUNDS = 10;

// Signup route - receives JSON { name, email, password }
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    // basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short (min 6)' });

    // check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // make token
    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    const user = new User({
      name,
      email,
      password: hashed,
      verifyToken: token,
      verifyTokenExpires: new Date(expires),
      verified: false
    });

    await user.save();

    // build verification url
    const verifyUrl = `${process.env.BASE_URL || ''}/api/auth/verify/${token}`;

    // send mail
    await sendVerificationEmail(email, name, verifyUrl);

    res.json({ message: 'Signup successful. Please check your email for verification.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// verify route
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send(`<h3>Invalid or expired token.</h3><p><a href="/">Return</a></p>`);
    }

    user.verified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    // Redirect to thank-you page (frontend)
    return res.redirect('/thankyou.html?name=' + encodeURIComponent(user.name));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
