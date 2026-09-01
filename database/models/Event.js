const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: '10 Trinity Church Rd, Hamilton ON L8W 3S2'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['worship', 'bible-study', 'youth', 'prayer', 'community', 'special'],
    default: 'worship'
  },
  recurring: {
    type: String,
    enum: ['none', 'weekly', 'monthly'],
    default: 'none'
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

eventSchema.index({ date: 1, published: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;