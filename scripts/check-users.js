require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      provider: String,
    }));

    const users = await User.find({});
    
    console.log(`📊 Total users in database: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 You need to register a new account first.\n');
    } else {
      console.log('👥 Users:');
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Provider: ${user.provider}`);
        console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`);
      });

      // Test password for first user with credentials
      const credUser = users.find(u => u.provider === 'credentials' && u.password);
      if (credUser) {
        console.log(`\n🔐 Testing password for: ${credUser.email}`);
        console.log('   Try logging in with this email and the password you used during registration.');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
