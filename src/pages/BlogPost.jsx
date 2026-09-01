import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../utils/api';
import DonateModal from '../components/DonateModal';
import './BlogPost.css';

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogAPI.getBySlug(slug);
      setBlog(response.data.data.blog);
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-post-page" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-post-page" style={{ paddingTop: '80px' }}>
        <div className="container">
          <div className="error-message">
            <h2>Blog Post Not Found</h2>
            <p>The blog post you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog" className="btn-primary">Back to Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="blog-post-header">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <div className="post-icon">{blog.icon}</div>
          <div className="post-meta">
            <span className="post-category">{blog.category}</span>
            <span className="post-date">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <h1>{blog.title}</h1>
          <p className="post-author">By {blog.author} • {blog.views} views</p>
        </div>
      </div>

      <div className="container blog-post-container">
        <article className="blog-post-content">
          <div className="post-excerpt">
            <p>{blog.excerpt}</p>
          </div>

          <div
            className="rich-text post-body"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags && blog.tags.length > 0 && (
            <div className="post-tags">
              <h4>Tags:</h4>
              <div className="tags-list">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="blog-post-sidebar">
          <div className="share-box">
            <h3>Share This Message</h3>
            <div className="share-buttons">
              <button
                onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                }}
                className="share-btn facebook"
              >
                f Facebook
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `Check out: ${blog.title}`;
                  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                }}
                className="share-btn twitter"
              >
                𝕏 Twitter
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="share-btn copy"
              >
                🔗 Copy Link
              </button>
            </div>
          </div>

          <div className="support-box">
            <h3>Support Our Mission</h3>
            <p>Your generous donation helps us continue spreading God's word.</p>
            <button
              className="btn-primary"
              onClick={() => setShowDonateModal(true)}
            >
              Donate Now
            </button>
          </div>
        </aside>
      </div>

      <div className="container">
        <div className="post-footer">
          <Link to="/blog" className="btn-secondary">← Back to All Messages</Link>
          <Link to="/contact" className="btn-primary">Get In Touch</Link>
        </div>
      </div>

      <DonateModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} />
    </div>
  );
}

export default BlogPost;