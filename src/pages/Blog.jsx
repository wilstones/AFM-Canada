import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogAPI } from '../utils/api';
import './Blog.css';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, category, search]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 12 };
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await blogAPI.getAll(params);
      setBlogs(response.data.data.blogs);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ 
      page: '1', 
      category: newCategory,
      ...(search && { search })
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    setSearchParams({ 
      page: '1', 
      search: searchValue,
      ...(category && { category })
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ 
      page: newPage.toString(),
      ...(category && { category }),
      ...(search && { search })
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="container">
          <h1>Messages & Sermons</h1>
          <p>Spiritual insights and teachings from our community</p>
        </div>
      </div>

      <div className="container blog-container">
        <aside className="blog-sidebar">
          <div className="search-box">
            <h3>Search</h3>
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                name="search"
                placeholder="Search messages..." 
                defaultValue={search}
              />
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </div>

          <div className="categories-box">
            <h3>Categories</h3>
            <button 
              className={`category-btn ${!category ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All Messages
            </button>
            <button 
              className={`category-btn ${category === 'sermon' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('sermon')}
            >
              Sermons
            </button>
            <button 
              className={`category-btn ${category === 'teaching' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('teaching')}
            >
              Teachings
            </button>
            <button 
              className={`category-btn ${category === 'testimony' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('testimony')}
            >
              Testimonies
            </button>
            <button 
              className={`category-btn ${category === 'announcement' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('announcement')}
            >
              Announcements
            </button>
          </div>
        </aside>

        <main className="blog-main">
          {loading ? (
            <div className="spinner"></div>
          ) : blogs.length === 0 ? (
            <div className="no-results">
              <h3>No messages found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              <div className="blog-grid">
                {blogs.map((blog) => (
                  <Link to={`/blog/${blog.slug}`} key={blog._id} className="blog-card">
                    <div className="blog-image">{blog.icon}</div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="blog-category">{blog.category}</span>
                        <span className="blog-date">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="blog-title">{blog.title}</h3>
                      <p className="blog-excerpt">{blog.excerpt}</p>
                      <div className="blog-footer">
                        <span className="blog-author">By {blog.author}</span>
                        <span className="blog-views">👁 {blog.views} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Blog;
