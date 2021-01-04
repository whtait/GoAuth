const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Require in the User Model.
const User = require('../../models/User');

// Register a user within the database.
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
],
  async (req, res) => {

    // Check for validation errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Pull name, email, and password off of the request body.
    const { name, email, password } = req.body;

    try {

      // Search for a user in the database.
      let user = await User.findOne({ email });

      // If a user already exists, exist the middleware cycle with response.
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists.' }]});
      }

      // Create a new instance of a User model with the provided information.
      user = new User({
        name,
        email,
        password
      });

      // Create a salt, and generate 10 rounds.
      const salt = await bcrypt.genSalt(10);

      // Hash the password so that it remains protected in the database.
      user.password = await bcrypt.hash(password, salt);

      // Save user to the database.
      await user.save();

      // Place the user id inside of the payload to go inside JWT.
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtAccess'),
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );

    } catch (error) {
      console.error(error.message);
      // If we error out, there was a server error.
      res.status(500).send('Server error');
    }

  });

  module.exports = router;