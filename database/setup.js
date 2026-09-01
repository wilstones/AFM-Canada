const connectDB = require('./connection');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Event = require('./models/Event');
require('dotenv').config();

const sampleBlogs = [
  {
    title: 'Walking in Faith: A Journey of Trust',
    icon: '📖',
    excerpt: 'Discover the power of unwavering faith in your daily walk with God. Learn how to trust Him in every circumstance and see His mighty hand at work.',
    content: `<h2>Introduction</h2>
<p>Faith is not just a concept we discuss in church; it's a living, breathing reality that should permeate every aspect of our lives. As Hebrews 11:1 tells us, "Now faith is confidence in what we hope for and assurance about what we do not see."</p>

<h2>The Foundation of Faith</h2>
<p>Our faith is built on the solid foundation of God's Word and His promises. Throughout Scripture, we see examples of men and women who chose to trust God even when circumstances seemed impossible.</p>

<h2>Practical Steps to Strengthen Your Faith</h2>
<ul>
<li>Daily prayer and meditation on God's Word</li>
<li>Surrounding yourself with a community of believers</li>
<li>Remembering God's faithfulness in past situations</li>
<li>Stepping out in obedience even when you don't see the full picture</li>
</ul>

<h2>Conclusion</h2>
<p>Walking in faith is a daily choice. Let us commit today to trust God more deeply and watch as He transforms our lives through His mighty power.</p>`,
    category: 'teaching',
    tags: ['faith', 'trust', 'spiritual growth'],
    featured: true,
    published: true
  },
  {
    title: 'The Power of Prayer in Our Lives',
    icon: '🙏',
    excerpt: 'Understanding the transformative power of prayer and how it strengthens our relationship with God. Prayer is our direct line to the throne of grace.',
    content: `<h2>What is Prayer?</h2>
<p>Prayer is our communication with God. It's not just asking for things, but developing a relationship with our Heavenly Father who loves us deeply.</p>

<h2>Different Types of Prayer</h2>
<p>The Bible teaches us various forms of prayer:</p>
<ul>
<li><strong>Adoration</strong> - Worshipping God for who He is</li>
<li><strong>Confession</strong> - Admitting our sins and seeking forgiveness</li>
<li><strong>Thanksgiving</strong> - Expressing gratitude for His blessings</li>
<li><strong>Supplication</strong> - Making requests for ourselves and others</li>
</ul>

<h2>The Promise of Prayer</h2>
<p>James 5:16 reminds us that "The prayer of a righteous person is powerful and effective." When we pray according to God's will, He hears us and answers.</p>`,
    category: 'sermon',
    tags: ['prayer', 'relationship', 'communication'],
    featured: true,
    published: true
  },
  {
    title: 'Community and Fellowship: The Heart of the Church',
    icon: '❤️',
    excerpt: 'The importance of gathering together as believers and supporting one another in love and faith. We are stronger together than apart.',
    content: `<h2>Created for Community</h2>
<p>God designed us for relationship - both with Him and with each other. Acts 2:42-47 paints a beautiful picture of the early church community.</p>

<h2>The Benefits of Fellowship</h2>
<p>When we gather together, we experience:</p>
<ul>
<li>Encouragement in difficult times</li>
<li>Accountability in our spiritual walk</li>
<li>Shared wisdom and experiences</li>
<li>Corporate worship that lifts our spirits</li>
<li>Opportunities to serve and be served</li>
</ul>

<h2>Building Strong Relationships</h2>
<p>Fellowship doesn't just happen on Sundays. It requires intentionality, vulnerability, and commitment to one another throughout the week.</p>`,
    category: 'teaching',
    tags: ['community', 'fellowship', 'church'],
    published: true
  }
];

const sampleEvents = [
  {
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly worship service featuring powerful preaching, uplifting music, and heartfelt fellowship. All are welcome!',
    date: new Date('2024-12-01T10:00:00'),
    time: '10:00 AM - 12:00 PM',
    location: '10 Trinity Church Rd, Hamilton ON L8W 3S2',
    category: 'worship',
    recurring: 'weekly',
    featured: true,
    published: true
  },
  {
    title: 'Midweek Bible Study',
    description: 'Dive deeper into God\'s Word with our community. We explore Scripture together and grow in understanding and faith.',
    date: new Date('2024-11-27T19:00:00'),
    time: '7:00 PM - 8:30 PM',
    category: 'bible-study',
    recurring: 'weekly',
    published: true
  },
  {
    title: 'Youth Ministry Gathering',
    description: 'Young people coming together for worship, games, and spiritual growth in a fun and welcoming environment.',
    date: new Date('2024-11-29T18:00:00'),
    time: '6:00 PM - 8:00 PM',
    category: 'youth',
    recurring: 'weekly',
    published: true
  },
  {
    title: 'Christmas Celebration Service',
    description: 'Join us for a special Christmas celebration with carols, testimonies, and a powerful message about the birth of our Savior.',
    date: new Date('2024-12-25T10:00:00'),
    time: '10:00 AM - 12:00 PM',
    category: 'special',
    featured: true,
    published: true
  }
];

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Event.deleteMany({});

    console.log('👤 Creating admin user...');
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@afmincanada.org',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      name: 'AFM Admin',
      role: 'admin',
      active: true
    });
    await adminUser.save();
    console.log(`✅ Admin user created: ${adminUser.email}`);

    console.log('📝 Creating sample blog posts...');
    await Blog.insertMany(sampleBlogs);
    console.log(`✅ ${sampleBlogs.length} blog posts created`);

    console.log('📅 Creating sample events...');
    await Event.insertMany(sampleEvents);
    console.log(`✅ ${sampleEvents.length} events created`);

    console.log('\n✨ Database setup complete!');
    console.log('\n📋 Summary:');
    console.log(`   - Admin Email: ${adminUser.email}`);
    console.log(`   - Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
    console.log(`   - Blog Posts: ${sampleBlogs.length}`);
    console.log(`   - Events: ${sampleEvents.length}`);
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
