const express = require('express');
const Member = require('../../database/models/Member');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public: submit new member interest form
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, province, city, postalCode, position, joinGroup } = req.body;

    if (!firstName || !lastName || !email || !phone || !province || !city || !postalCode || !position) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const member = new Member({
      firstName, lastName, email, phone, province, city, postalCode, position,
      joinGroup: joinGroup !== undefined ? joinGroup : true
    });

    await member.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! We have received your information and will be in touch soon.'
    });
  } catch (error) {
    console.error('Member signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
});

// Admin: get all submissions
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const members = await Member.find(query).sort({ createdAt: -1 }).lean();

    res.json({ success: true, data: { members } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch members' });
  }
});

// Admin: update status (new / contacted / added)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'added'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({ success: true, data: { member } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Admin: delete a submission
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, message: 'Entry removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete entry' });
  }
});

module.exports = router;