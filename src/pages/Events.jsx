import { useEffect, useState } from 'react';
import { eventAPI } from '../utils/api';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll({ upcoming: 'true', limit: 20 });
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      worship: '🙏',
      'bible-study': '📖',
      youth: '🎉',
      prayer: '🕊️',
      community: '❤️',
      special: '⭐'
    };
    return icons[category] || '📅';
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="container">
          <h1>Upcoming Events</h1>
          <p>Join us for worship, fellowship, and community</p>
        </div>
      </div>

      <div className="container events-container">
        {loading ? (
          <div className="spinner"></div>
        ) : events.length === 0 ? (
          <div className="no-events">
            <h3>No upcoming events</h3>
            <p>Check back soon for new events and gatherings!</p>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event) => {
              const dateInfo = formatDate(event.date);
              return (
                <div key={event._id} className="event-card">
                  <div className="event-date-col">
                    <div className="event-date-box">
                      <div className="event-day">{dateInfo.day}</div>
                      <div className="event-month">{dateInfo.month}</div>
                    </div>
                    <div className="event-weekday">{dateInfo.weekday}</div>
                  </div>

                  <div className="event-details">
                    <div className="event-category">
                      {getCategoryIcon(event.category)} {event.category}
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-info-row">
                      <span>⏰ {event.time}</span>
                      <span>📍 {event.location}</span>
                    </div>
                    <p className="event-description">{event.description}</p>
                    {event.recurring !== 'none' && (
                      <div className="event-recurring">
                        🔄 Recurring {event.recurring}
                      </div>
                    )}
                  </div>

                  {event.imageUrl && (
                    <div className="event-image-col">
                      <img src={event.imageUrl} alt={event.title} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;