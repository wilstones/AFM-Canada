const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    default: '📖'
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'AFM Canada'
  },
  category: {
    type: String,
    enum: ['sermon', 'announcement', 'testimony', 'teaching', 'event'],
    default: 'sermon'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    pray: { type: Number, default: 0 },
    amen: { type: Number, default: 0 }
  },
}, {
  timestamps: true
});

// Create slug from title
blogSchema.pre('validate', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ category: 1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
