import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="container contact-container">
        <div className="contact-info">
          <h2>Visit Us</h2>
          <div className="info-card">
            <h3>📍 Address</h3>
            <p>10 Trinity Church Rd<br/>Hamilton ON L8W 3S2<br/>Canada</p>
          </div>

          <div className="info-card">
            <h3>📧 Email</h3>
            <p>
              Pastor: <a href="mailto:Pastor-LeoM@afmincanada.org">Pastor-LeoM@afmincanada.org</a><br/>
              Admin: <a href="mailto:administrator@afmincanada.org">administrator@afmincanada.org</a>
            </p>
          </div>

          <div className="info-card">
            <h3>📞 Phone</h3>
            <p>
              <a href="tel:+16138043852">+1 (613) 804-3852</a><br/>
              <a href="tel:+19054018801">+1 (905) 401-8801</a>
            </p>
          </div>

          <div className="info-card">
            <h3>🌐 Connect With Us</h3>
            <div className="social-buttons">
              <a href="https://www.facebook.com/afmincanada" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                Facebook
              </a>
              <a href="https://instagram.com/afmincanada" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                Instagram
              </a>
              <a href="https://youtube.com/@afmincanada" target="_blank" rel="noopener noreferrer" className="social-btn youtube">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="contact-hours">
          <h2>Service Times</h2>
          <div className="hours-card">
            <h3>🙏 Sunday Worship</h3>
            <p>10:00 AM - 12:00 PM</p>
          </div>
          <div className="hours-card">
            <h3>📖 Midweek Bible Study</h3>
            <p>Wednesday, 7:00 PM - 8:30 PM</p>
          </div>
          <div className="hours-card">
            <h3>🎉 Youth Ministry</h3>
            <p>Friday, 6:00 PM - 8:00 PM</p>
          </div>
        </div>
      </div>

      <div className="map-section">
        <div className="container">
          <h2>Find Us</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2910.4445!2d-79.820187!3d43.1826782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9757c13a0f81%3A0xf0205007d60a2f3d!2sTrinity%20Church%20Cemetery%2C%2010%20Trinity%20Church%20Rd%2C%20Hamilton%2C%20ON%20L8W%203S2%2C%20Canada!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '15px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
