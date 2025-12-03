// Quick MongoDB connection test
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://cv-build:cv-build@cv-builder.pcxrkv7.mongodb.net/?retryWrites=true&w=majority&appName=cv-builder';

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ ERROR! MongoDB connection failed:');
    console.log('Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Database user "cv-builder" does not exist');
    console.log('2. Password "Eden2016" is incorrect');
    console.log('3. IP address not whitelisted');
    console.log('4. Database user does not have correct permissions');
    process.exit(1);
  });
