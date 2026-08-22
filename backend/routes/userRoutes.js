const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');

const updateUser = async (req, res) => {
  try {
    const { name, email, mobile, tag } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, mobile, tag },
      { new: true, runValidators: true },
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      tag: user.tag,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.log('Error during updating the profile:', err);
    return res.status(500).json({ error: 'Server error during updating profile' });
  }
};

router.patch('/', authenticateToken, updateUser);
router.post('/', authenticateToken, updateUser);

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      tag: user.tag,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.log('Error during retriving the profile:', err);
    res.status(500).json({ error: 'Server error during retriving profile' });
  }
});

module.exports = router;
