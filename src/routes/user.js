const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const router = express.Router();
const saltRounds = 10;

// Create a user
router.post("/sign-up", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username.length < 4) {
      return res.status(400).json({
        message: "Username must have atleast 4 symbols.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must have atleast 8 symbols.",
      });
    }

    const user = await User.find({ username });

    if (user.length) {
      return res.status(409).json({
        message: `User with username '${username}' is already exist.`,
      });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hash,
    });

    await newUser.save();

    res.json({
      message: "User has been successfully created.",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;

  if (username.length < 4) {
    return res.status(400).json({
      message: "Username must have atleast 4 symbols.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must have atleast 8 symbols.",
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({
      message: "The username or password is incorrect.",
    });
  }

  bcrypt.compare(password, user.password, async (err, result) => {
    if (!result) {
      return res.status(400).json({
        message: "The username or password is incorrect.",
      });
    }

    const token = generateAccessToken({ username, id: user._id });
    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET);

    const _refreshToken = new RefreshToken({
      value: refreshToken
    });
    
    await _refreshToken.save();

    return res.json({
      token,
      refreshToken,
      message: "You have successfully signed in.",
    });
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' }); 
}

module.exports = router;