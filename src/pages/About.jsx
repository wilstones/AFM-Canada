import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <h1>About AFM in Canada</h1>
          <p>Our Story, Mission, and Vision</p>
        </div>
      </div>

      <div className="container about-container">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            The Apostolic Faith Mission (AFM) is a missionary church – a community of God's people that defines themselves as agents of God. We are rooted in John 3:16: "For God so loved the world that He gave His only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
          </p>
          <p>
            God sent His Son to redeem us. We confess that being missionary is the activity of God Himself. This prime calling of the church is deeply embedded in the AFM since our birth in 1908.
          </p>
        </section>

        <section className="about-section">
          <h2>Our History</h2>
          <p>
            The AFM exists since 1908 and is the first and largest Pentecostal church, currently established in 34 countries across the world. Our journey began with a powerful move of God's Spirit, and we continue to see His hand at work in miraculous ways.
          </p>
          <p>
            The AFM in Canada - Hamilton Assembly has been serving the local community for decades, providing spiritual guidance, fellowship, and support to all who seek God's presence.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Beliefs</h2>
          <div className="beliefs-grid">
            <div className="belief-card">
              <h3>📖 The Bible</h3>
              <p>
                We believe the Bible is the inspired Word of God, equally in all parts and without error in its original manuscript. It is absolutely infallible and our source of supreme revelation from God.
              </p>
            </div>
            <div className="belief-card">
              <h3>✝️ The Trinity</h3>
              <p>
                We believe in one God who exists eternally in three persons: Father, Son, and Holy Spirit, co-equal in nature, power, and glory.
              </p>
            </div>
            <div className="belief-card">
              <h3>🕊️ The Holy Spirit</h3>
              <p>
                We believe in the baptism of the Holy Spirit as a distinct experience following salvation, evidenced by speaking in tongues as the Spirit gives utterance.
              </p>
            </div>
            <div className="belief-card">
              <h3>💒 The Church</h3>
              <p>
                We believe the Church is the body of Christ, called to worship, fellowship, discipleship, ministry, and mission.
              </p>
            </div>
            <div className="belief-card">
              <h3>🙏 Prayer & Healing</h3>
              <p>
                We believe in the power of prayer and divine healing through faith in Jesus Christ.
              </p>
            </div>
            <div className="belief-card">
              <h3>👑 Christ's Return</h3>
              <p>
                We believe in the personal, visible return of Jesus Christ to establish His kingdom on earth.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section scripture-section">
          <h2>Our Theme Scripture</h2>
          <blockquote>
            "Then God said, 'Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.'"
            <cite>— Genesis 1:26</cite>
          </blockquote>
        </section>

        <section className="about-section vision-section">
          <h2>Our Vision & Mission</h2>
          <div className="vision-grid">
            <div className="vision-card">
              <h3>Vision</h3>
              <p>
                To be a vibrant, Spirit-filled community that transforms lives through the power of the Gospel, impacting our city and beyond for the glory of God.
              </p>
            </div>
            <div className="vision-card">
              <h3>Mission</h3>
              <p>
                To worship God, build authentic community, make disciples, serve compassionately, and share the love of Christ with all people.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section cta-section">
          <h2>Join Our Community</h2>
          <p>
            We invite you to become part of our church family. Whether you're seeking God, looking for a church home, or want to grow in your faith, we welcome you with open arms.
          </p>
          <div className="cta-buttons">
            <a href="/contact" className="btn-primary">Visit Us</a>
            <a href="/events" className="btn-secondary">See Our Events</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
