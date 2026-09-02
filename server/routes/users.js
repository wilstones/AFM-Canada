const express = require('express');
const User = require('../../database/models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Create new user (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with that email already exists'
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'editor',
      active: true
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// Toggle active status (Admin only)
router.patch('/:id/toggle-active', adminAuth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.active = !user.active;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
      data: { user: { id: user._id, active: user.active } }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// Delete user (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

module.exports = router;