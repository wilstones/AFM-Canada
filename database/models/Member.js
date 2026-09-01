const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  province: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true, uppercase: true },
  joinGroup: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'added'],
    default: 'new'
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

memberSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Member', memberSchema);