#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Updating MongoDB Atlas Connection String\n');

try {
  // Your MongoDB Atlas connection string
  const mongoUri = 'mongodb+srv://prabin4444a:bGHIA1Gvabxgnmmh@todocluster.twfvhpv.mongodb.net/?retryWrites=true&w=majority&appName=TodoCluster';
  
  // Add database name to the URI
  const mongoUriWithDB = mongoUri.replace('?retryWrites=true&w=majority&appName=TodoCluster', '/todo?retryWrites=true&w=majority&appName=TodoCluster');

  // Read existing backend .env
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  let backendEnvContent = '';
  
  if (fs.existsSync(backendEnvPath)) {
    backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
  }

  // Update MongoDB URI
  const updatedBackendEnv = backendEnvContent
    .replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoUriWithDB}`);

  // Write updated .env file
  fs.writeFileSync(backendEnvPath, updatedBackendEnv);

  console.log('✅ Updated backend/.env with MongoDB Atlas connection string!');
  console.log(`📊 Database: ${mongoUriWithDB}`);
  
  console.log('\n🔄 Please restart your application:');
  console.log('1. Stop the current application (Ctrl+C)');
  console.log('2. Run: npm run dev');
  console.log('3. Test Google OAuth at: http://localhost:3000');
  
  console.log('\n🎉 Your Todo app should now work with:');
  console.log('- ✅ Google OAuth login/signup');
  console.log('- ✅ User data stored in MongoDB Atlas');
  console.log('- ✅ No more database connection errors');

} catch (error) {
  console.error('❌ Error updating MongoDB connection:', error);
} 