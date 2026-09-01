import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, blogAPI, eventAPI, memberAPI } from '../utils/api';
import './AdminDashboard.css';

const emptyEventForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '10 Trinity Church Rd, Hamilton ON L8W 3S2',
  category: 'worship',
  recurring: 'none',
  featured: false,
  published: true
};

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', icon: '📖', excerpt: '', content: '',
    category: 'sermon', tags: '', featured: false, published: true
  });

  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Member filter state
  const [memberFilter, setMemberFilter] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (user && activeTab === 'members') {
      fetchMembers();
    }
  }, [memberFilter, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [blogsRes, eventsRes, membersRes] = await Promise.all([
        blogAPI.getAllAdmin(),
        eventAPI.getAllAdmin(),
        memberAPI.getAll()
      ]);
      setBlogs(blogsRes.data.data.blogs);
      setEvents(eventsRes.data.data.events);
      setMembers(membersRes.data.data.members);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const params = memberFilter ? { status: memberFilter } : {};
      const res = await memberAPI.getAll(params);
      setMembers(res.data.data.members);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  // ---------- BLOG HANDLERS ----------
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (editingBlog) {
        await blogAPI.update(editingBlog._id, data);
      } else {
        await blogAPI.create(data);
      }
      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogForm({ title: '', icon: '📖', excerpt: '', content: '', category: 'sermon', tags: '', featured: false, published: true });
      fetchData();
    } catch (error) {
      alert('Failed to save blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title, icon: blog.icon, excerpt: blog.excerpt, content: blog.content,
      category: blog.category, tags: blog.tags?.join(', ') || '',
      featured: blog.featured, published: blog.published
    });
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogAPI.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete blog');
    }
  };

  const handleToggleBlogPublish = async (id) => {
    try {
      await blogAPI.togglePublish(id);
      fetchData();
    } catch (error) {
      alert('Failed to toggle publish status');
    }
  };

  // ---------- EVENT HANDLERS ----------
  const resetEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setEventForm(emptyEventForm);
    setCoverImageFile(null);
    setCoverImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('time', eventForm.time);
      formData.append('location', eventForm.location);
      formData.append('category', eventForm.category);
      formData.append('recurring', eventForm.recurring);
      formData.append('featured', eventForm.featured);
      formData.append('published', eventForm.published);
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      if (editingEvent) {
        await eventAPI.update(editingEvent._id, formData);
      } else {
        await eventAPI.create(formData);
      }

      resetEventForm();
      fetchData();
    } catch (error) {
      alert('Failed to save event: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time,
      location: event.location,
      category: event.category,
      recurring: event.recurring,
      featured: event.featured,
      published: event.published
    });
    setCoverImagePreview(event.imageUrl || '');
    setCoverImageFile(null);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventAPI.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handleToggleEventPublish = async (id) => {
    try {
      await eventAPI.togglePublish(id);
      fetchData();
    } catch (error) {
      alert('Failed to toggle publish status');
    }
  };

  // ---------- PASSWORD CHANGE HANDLER ----------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password.'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ---------- MEMBER HANDLERS ----------
  const handleMemberStatus = async (id, status) => {
    try {
      await memberAPI.updateStatus(id, status);
      fetchMembers();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Remove this entry? This cannot be undone.')) return;
    try {
      await memberAPI.delete(id);
      fetchMembers();
    } catch (error) {
      alert('Failed to delete entry');
    }
  };

  if (!user) return null;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>
      </div>

      <div className="container dashboard-container">
        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
            📝 Blog Posts
          </button>
          <button className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            📅 Events
          </button>
          <button className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
            🙋 New Members
            {members.filter(m => m.status === 'new').length > 0 && (
              <span className="tab-count">{members.filter(m => m.status === 'new').length}</span>
            )}
          </button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            📊 Statistics
          </button>
          <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
            🔒 Account Settings
          </button>
        </div>

        {/* BLOGS TAB */}
        {activeTab === 'blogs' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Manage Blog Posts</h2>
              <button className="btn-primary" onClick={() => {
                setShowBlogForm(true);
                setEditingBlog(null);
                setBlogForm({ title: '', icon: '📖', excerpt: '', content: '', category: 'sermon', tags: '', featured: false, published: true });
              }}>
                + Create New Post
              </button>
            </div>

            {showBlogForm && (
              <div className="blog-form-container">
                <h3>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
                <form onSubmit={handleBlogSubmit} className="blog-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                    </div>
                    <div className="form-group" style={{ maxWidth: '150px' }}>
                      <label>Icon</label>
                      <input type="text" value={blogForm.icon} onChange={(e) => setBlogForm({ ...blogForm, icon: e.target.value })} maxLength="2" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Excerpt *</label>
                    <textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows="3" required />
                  </div>

                  <div className="form-group">
                    <label>Content * (HTML supported)</label>
                    <textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} rows="12" required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}>
                        <option value="sermon">Sermon</option>
                        <option value="teaching">Teaching</option>
                        <option value="testimony">Testimony</option>
                        <option value="announcement">Announcement</option>
                        <option value="event">Event</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tags (comma separated)</label>
                      <input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} placeholder="faith, prayer, worship" />
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={blogForm.featured} onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })} />
                      Featured Post
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={blogForm.published} onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })} />
                      Publish Immediately
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {editingBlog ? 'Update Post' : 'Publish Post'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="blogs-list">
              {loading ? <div className="spinner"></div> : blogs.length === 0 ? (
                <p className="no-data">No blog posts yet. Create your first post!</p>
              ) : (
                blogs.map(blog => (
                  <div key={blog._id} className="blog-item">
                    <div className="blog-item-header">
                      <div>
                        <h3>{blog.icon} {blog.title}</h3>
                        <p className="blog-meta">
                          {blog.category} • {new Date(blog.createdAt).toLocaleDateString()} • {blog.views} views
                          {blog.featured && <span className="badge featured">Featured</span>}
                          <span className={`badge ${blog.published ? 'published' : 'draft'}`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </p>
                      </div>
                      <div className="blog-actions">
                        <button onClick={() => handleEditBlog(blog)} className="btn-small btn-edit">Edit</button>
                        <button onClick={() => handleToggleBlogPublish(blog._id)} className="btn-small btn-toggle">
                          {blog.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDeleteBlog(blog._id)} className="btn-small btn-delete">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Manage Events</h2>
              <button className="btn-primary" onClick={() => {
                setShowEventForm(true);
                setEditingEvent(null);
                setEventForm(emptyEventForm);
                setCoverImageFile(null);
                setCoverImagePreview('');
              }}>
                + Create New Event
              </button>
            </div>

            {showEventForm && (
              <div className="blog-form-container">
                <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                <form onSubmit={handleEventSubmit} className="blog-form">
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. Christmas Celebration Service" required />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows="3" required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Time *</label>
                      <input type="text" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="10:00 AM - 12:00 PM" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location / Venue *</label>
                    <input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label>Cover Image</label>
                    <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" onChange={handleImageChange} />
                    {coverImagePreview && (
                      <img src={coverImagePreview} alt="Cover preview" className="cover-image-preview" />
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}>
                        <option value="worship">Worship</option>
                        <option value="bible-study">Bible Study</option>
                        <option value="youth">Youth</option>
                        <option value="prayer">Prayer</option>
                        <option value="community">Community</option>
                        <option value="special">Special</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Recurring</label>
                      <select value={eventForm.recurring} onChange={(e) => setEventForm({ ...eventForm, recurring: e.target.value })}>
                        <option value="none">None</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={eventForm.featured} onChange={(e) => setEventForm({ ...eventForm, featured: e.target.checked })} />
                      Featured Event
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={eventForm.published} onChange={(e) => setEventForm({ ...eventForm, published: e.target.checked })} />
                      Publish Immediately
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {editingEvent ? 'Update Event' : 'Publish Event'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={resetEventForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="blogs-list">
              {loading ? <div className="spinner"></div> : events.length === 0 ? (
                <p className="no-data">No events yet. Create your first event!</p>
              ) : (
                events.map(event => (
                  <div key={event._id} className="blog-item event-item">
                    {event.imageUrl && (
                      <img src={event.imageUrl} alt={event.title} className="event-thumb" />
                    )}
                    <div className="blog-item-header">
                      <div>
                        <h3>{event.title}</h3>
                        <p className="blog-meta">
                          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {event.time} • {event.location}
                        </p>
                        <p className="blog-meta">
                          {event.category}
                          {event.recurring !== 'none' && <span className="badge featured">Recurring: {event.recurring}</span>}
                          {event.featured && <span className="badge featured">Featured</span>}
                          <span className={`badge ${event.published ? 'published' : 'draft'}`}>
                            {event.published ? 'Published' : 'Draft'}
                          </span>
                        </p>
                      </div>
                      <div className="blog-actions">
                        <button onClick={() => handleEditEvent(event)} className="btn-small btn-edit">Edit</button>
                        <button onClick={() => handleToggleEventPublish(event._id)} className="btn-small btn-toggle">
                          {event.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDeleteEvent(event._id)} className="btn-small btn-delete">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* NEW MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>New Member Sign-Ups</h2>
              <select
                className="member-filter"
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="added">Added to Group</option>
              </select>
            </div>

            <div className="blogs-list">
              {members.length === 0 ? (
                <p className="no-data">No sign-ups yet. Submissions from the "Join Us" page will appear here.</p>
              ) : (
                members.map(member => (
                  <div key={member._id} className="blog-item">
                    <div className="blog-item-header">
                      <div>
                        <h3>{member.firstName} {member.lastName}</h3>
                        <p className="blog-meta">
                          ✉️ {member.email} &nbsp;•&nbsp; 📞 {member.phone}
                        </p>
                        <p className="blog-meta">
                          📍 {member.city}, {member.province} &nbsp;•&nbsp; {member.postalCode}
                        </p>
                        <p className="blog-meta">
                          {member.joinGroup ? '✅ Wants to join a local group' : '➖ Did not request group placement'}
                          &nbsp;•&nbsp; Submitted {new Date(member.createdAt).toLocaleDateString()}
                          <span className={`badge status-${member.status}`}>
                            {member.status === 'new' ? 'New' : member.status === 'contacted' ? 'Contacted' : 'Added to Group'}
                          </span>
                        </p>
                      </div>
                      <div className="blog-actions">
                        {member.status !== 'contacted' && (
                          <button onClick={() => handleMemberStatus(member._id, 'contacted')} className="btn-small btn-toggle">
                            Mark Contacted
                          </button>
                        )}
                        {member.status !== 'added' && (
                          <button onClick={() => handleMemberStatus(member._id, 'added')} className="btn-small btn-edit">
                            Mark Added
                          </button>
                        )}
                        <button onClick={() => handleDeleteMember(member._id)} className="btn-small btn-delete">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <h2>Website Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{blogs.length}</div>
                <div className="stat-label">Total Posts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{blogs.filter(b => b.published).length}</div>
                <div className="stat-label">Published Posts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{blogs.reduce((sum, b) => sum + b.views, 0)}</div>
                <div className="stat-label">Total Views</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{events.length}</div>
                <div className="stat-label">Total Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{events.filter(e => e.published).length}</div>
                <div className="stat-label">Published Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{members.length}</div>
                <div className="stat-label">Member Sign-Ups</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{members.filter(m => m.status === 'new').length}</div>
                <div className="stat-label">Awaiting Follow-Up</div>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT SETTINGS TAB */}
        {activeTab === 'account' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Account Settings</h2>
            </div>

            <div className="blog-form-container" style={{ maxWidth: '500px' }}>
              <h3>Change Password</h3>

              {passwordMessage.text && (
                <div className={passwordMessage.type === 'error' ? 'error-message' : 'success-message'}>
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="blog-form">
                <div className="form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    minLength="6"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    minLength="6"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={passwordLoading}>
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;