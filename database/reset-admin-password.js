const connectDB = require('./connection');
const User = require('./models/User');
require('dotenv').config();

const NEW_PASSWORD = 'ChangeThisPassword123!'; // ← edit this before running

async function resetPassword() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@afmincanada.org' });

    if (!admin) {
      console.log('❌ No admin user found with that email.');
      process.exit(1);
    }

    admin.password = NEW_PASSWORD; // the User model's pre-save hook hashes this automatically
    await admin.save();

    console.log(`✅ Password reset successfully for ${admin.email}`);
    console.log(`   New password: ${NEW_PASSWORD}`);
    console.log('   Change this again via the dashboard once logged in, for safety.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetPassword();