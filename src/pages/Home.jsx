import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI, eventAPI } from '../utils/api';
import DonateModal from '../components/DonateModal';
import './Home.css';

function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsRes, eventsRes] = await Promise.all([
        blogAPI.getAll({ featured: 'true', limit: 3 }),
        eventAPI.getAll({ upcoming: 'true', limit: 3 })
      ]);

      setFeaturedBlogs(blogsRes.data.data.blogs);
      setUpcomingEvents(eventsRes.data.data.events);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text fade-in-up">
            <h1>Welcome to AFM in Canada</h1>
            <p>A missionary church rooted in love, faith, and community. Join us as we spread God's word and serve together since 1908.</p>
            <div className="hero-buttons">
              <Link to="/about" className="btn-primary">Learn More</Link>
              <Link to="/events" className="btn-secondary">Upcoming Events</Link>
            </div>
          </div>
          <div className="hero-image fade-in">
            <img 
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop" 
              alt="Church Community"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23D4A574" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dy=".3em"%3EAFM Community%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-subtitle">Serving God and community since 1908</p>
          <div className="mission-grid">
            <div className="mission-card fade-in-up">
              <div className="mission-icon">✝️</div>
              <h3>Faith</h3>
              <p>Rooted in John 3:16, we believe in the transformative power of God's love through Jesus Christ.</p>
            </div>
            <div className="mission-card fade-in-up">
              <div className="mission-icon">❤️</div>
              <h3>Community</h3>
              <p>Building strong relationships and supporting one another in our spiritual journey together.</p>
            </div>
            <div className="mission-card fade-in-up">
              <div className="mission-icon">🌍</div>
              <h3>Mission</h3>
              <p>Spreading God's word as a missionary church established in 34 countries worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="featured-blogs-section">
        <div className="container">
          <h2 className="section-title">Latest Messages</h2>
          <p className="section-subtitle">Spiritual insights and teachings from our community</p>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="blog-grid">
              {featuredBlogs.map((blog) => (
                <Link to={`/blog/${blog.slug}`} key={blog._id} className="blog-card">
                  <div className="blog-image">{blog.icon}</div>
                  <div className="blog-content">
                    <div className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/blog" className="btn-primary">View All Messages</Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="events-section">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join us for worship, fellowship, and community</p>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="events-list">
              {upcomingEvents.map((event) => {
                const { day, month } = formatDate(event.date);
                return (
                  <div key={event._id} className="event-card">
                    <div className="event-date">
                      <div className="event-date-day">{day}</div>
                      <div className="event-date-month">{month}</div>
                    </div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p>📍 {event.location} | ⏰ {event.time}</p>
                      <p>{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/events" className="btn-primary">View All Events</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Community</h2>
            <p>Experience the warmth of fellowship and the power of faith. We'd love to welcome you!</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Get In Touch</Link>
              <button
                className="btn-secondary"
                onClick={() => setShowDonateModal(true)}
              >
                Support Our Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      <DonateModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} />
    </div>
  );
}

export default Home;