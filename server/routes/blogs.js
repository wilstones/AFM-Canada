const express = require('express');
const Blog = require('../../database/models/Blog');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all published blogs (Public)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      featured,
      search 
    } = req.query;

    const query = { published: true };
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs'
    });
  }
});

// Get single blog by slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      published: true 
    }).select('-__v');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog'
    });
  }
});
// Add a reaction to a blog post (Public, no auth needed)
router.patch('/:id/react', async (req, res) => {
  try {
    const { type } = req.body;
    const validTypes = ['like', 'love', 'pray', 'amen'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type'
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: { reactions: blog.reactions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction'
    });
  }
});

// Get all blogs including unpublished (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const blogs = await Blog.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Blog.countDocuments();

    res.json({
      success: true,
      data: {
        blogs,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs'
    });
  }
});

// Create new blog (Auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, icon, excerpt, content, category, tags, featured, published } = req.body;

    // Validation
    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, excerpt, and content are required'
      });
    }

    const blog = new Blog({
      title,
      icon: icon || '📖',
      excerpt,
      content,
      category: category || 'sermon',
      tags: tags || [],
      featured: featured || false,
      published: published !== undefined ? published : true,
      author: req.user.name
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog'
    });
  }
});

// Update blog (Auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, icon, excerpt, content, category, tags, featured, published } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (icon) blog.icon = icon;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (featured !== undefined) blog.featured = featured;
    if (published !== undefined) blog.published = published;

    await blog.save();

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog }
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog'
    });
  }
});

// Delete blog (Auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
});

// Toggle publish status (Auth required)
router.patch('/:id/toggle-publish', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.published = !blog.published;
    await blog.save();

    res.json({
      success: true,
      message: `Blog ${blog.published ? 'published' : 'unpublished'} successfully`,
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle publish status'
    });
  }
});

module.exports = router;
