const express = require('express');
const fs = require('fs');
const path = require('path');
const Event = require('../../database/models/Event');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, '../../', imageUrl);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete old event image:', err.message);
    }
  });
};

// Get upcoming published events (Public)
router.get('/', async (req, res) => {
  try {
    const { upcoming = 'true', limit = 10 } = req.query;
    const query = { published: true };
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: { events } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Get ALL events including drafts (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const events = await Event.find()
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: { events } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Get single event (Public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, published: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: { event } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event' });
  }
});

// Create event with optional cover image (Auth required)
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const eventData = { ...req.body };

    if (eventData.featured !== undefined) {
      eventData.featured = eventData.featured === 'true' || eventData.featured === true;
    }
    if (eventData.published !== undefined) {
      eventData.published = eventData.published === 'true' || eventData.published === true;
    }

    if (req.file) {
      eventData.imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({ success: true, message: 'Event created successfully', data: { event } });
  } catch (error) {
    if (req.file) deleteImageFile(`/uploads/events/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message || 'Failed to create event' });
  }
});

// Update event, optionally replacing the cover image (Auth required)
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) {
      if (req.file) deleteImageFile(`/uploads/events/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updateData = { ...req.body };

    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }
    if (updateData.published !== undefined) {
      updateData.published = updateData.published === 'true' || updateData.published === true;
    }

    if (req.file) {
      deleteImageFile(existingEvent.imageUrl);
      updateData.imageUrl = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Event updated successfully', data: { event } });
  } catch (error) {
    if (req.file) deleteImageFile(`/uploads/events/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message || 'Failed to update event' });
  }
});

// Toggle publish status (Auth required)
router.patch('/:id/toggle-publish', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    event.published = !event.published;
    await event.save();

    res.json({
      success: true,
      message: `Event ${event.published ? 'published' : 'unpublished'} successfully`,
      data: { event }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle publish status' });
  }
});

// Delete event and its cover image (Auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    deleteImageFile(event.imageUrl);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

module.exports = router;