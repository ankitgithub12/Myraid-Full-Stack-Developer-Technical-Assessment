/**
 * One-time database cleanup script.
 * 
 * Run this ONCE from your server directory to delete all users who
 * have double-hashed passwords (corrupted before the pre-save bug was fixed).
 * After running this, re-register your accounts fresh.
 * 
 * Usage:
 *   cd server
 *   node scripts/clearUsers.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌  MONGO_URI not found in .env file. Aborting.');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`🗑️   Deleted ${result.deletedCount} user(s). The database is now clean.`);
    console.log('');
    console.log('👉  You can now re-register your account from the app.');

  } catch (err) {
    console.error('❌  Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB.');
    process.exit(0);
  }
};

run();
