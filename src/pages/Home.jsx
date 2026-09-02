import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI, eventAPI } from '../utils/api';
import DonateModal from '../components/DonateModal';
import './Home.css';
import HeroSlider from '../components/HeroSlider';

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
  <HeroSlider />
</div>
        </div>
      </section>

      {/* Theme Scripture for the Year */}
      <section className="theme-scripture-section">
        <div className="container">
          <div className="theme-badge">2026 Theme</div>
          <h2 className="section-title">The Year of Breaking Boundaries and Obtaining Increase</h2>
          <p className="section-subtitle">Our Theme Scripture</p>

          <div className="scripture-cards">
            <div className="scripture-card">
              <div className="scripture-reference">Genesis 26:12-14</div>
              <p>
                "And Isaac sowed in that land and reaped in the same year a hundredfold. The Lord blessed him, and the man became rich, and gained more and more until he became very wealthy. He had possessions of flocks and herds and many servants, so that the Philistines envied him."
              </p>
            </div>

            <div className="scripture-card">
              <div className="scripture-reference">Luke 5:4-7</div>
              <p>
                "Getting into one of the boats, which was Simon's, he asked him to put out a little from the land. And he sat down and taught the people from the boat. And when he had finished speaking, he said to Simon, 'Put out into the deep and let down your nets for a catch.' And Simon answered, 'Master, we toiled all night and took nothing! But at your word I will let down the nets.' And when they had done this, they enclosed a large number of fish, and their nets were breaking. They signaled to their partners in the other boat to come and help them. And they came and filled both the boats, so that they began to sink."
              </p>
            </div>
          </div>

          <div className="theme-video">
            <h3>Watch the Message</h3>
            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/7XOdKKARSnM"
                title="Theme Scripture Sermon"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
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