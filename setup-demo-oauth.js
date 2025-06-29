#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🎭 Demo Google OAuth Setup\n');
console.log('This will create environment files with placeholder credentials for testing.\n');
console.log('⚠️  Note: Google login will not work with these placeholder credentials.');
console.log('   You need to replace them with real Google OAuth credentials later.\n');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Backend .env content with placeholder credentials
const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todo-app

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# Google OAuth Configuration (PLACEHOLDER - Replace with real credentials)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

// Frontend .env content
const frontendEnvContent = `# API Configuration
VITE_API_URL=http://localhost:5000/api
`;

try {
  // Write backend .env file
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file with placeholder credentials');

  // Write frontend .env file
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env file');

  console.log('\n🎉 Demo Setup Complete!\n');
  console.log('Your application is now configured with:');
  console.log(`- JWT Secret: ${jwtSecret.substring(0, 20)}...`);
  console.log('- Placeholder Google OAuth credentials');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Restart your backend server: npm run dev:backend');
  console.log('2. Restart your frontend server: npm run dev:frontend');
  console.log('3. Test the application at: http://localhost:3000');
  console.log('4. Use email/password registration and login (Google login will show error)');
  
  console.log('\n🔧 To enable Google OAuth later:');
  console.log('1. Get real Google OAuth credentials from Google Cloud Console');
  console.log('2. Replace the placeholder values in backend/.env');
  console.log('3. Restart the backend server');
  
  console.log('\n📚 For real Google OAuth setup:');
  console.log('- Run: npm run setup:google-oauth');
  console.log('- Or follow the guide in GOOGLE_OAUTH_SETUP.md');

} catch (error) {
  console.error('❌ Demo setup failed:', error.message);
  process.exit(1);
} 