#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Google OAuth Setup for Todo Task Management\n');
console.log('This script will help you set up Google OAuth authentication.\n');

async function setupGoogleOAuth() {
  try {
    console.log('📋 Step 1: Google Cloud Console Setup\n');
    console.log('Please follow these steps in your browser:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Google+ API (or Google Identity API)');
    console.log('4. Create OAuth 2.0 credentials');
    console.log('5. Configure OAuth consent screen');
    console.log('6. Add authorized redirect URI: http://localhost:5000/api/auth/google/callback');
    console.log('\nOnce you have your Client ID and Client Secret, continue below.\n');

    const clientId = await question('Enter your Google Client ID: ');
    const clientSecret = await question('Enter your Google Client Secret: ');
    
    if (!clientId || !clientSecret) {
      console.log('❌ Client ID and Client Secret are required!');
      process.exit(1);
    }

    console.log('\n📝 Step 2: Creating Environment Files\n');

    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');

    // Backend .env content
    const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todo-app

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
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

    // Write backend .env file
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created backend/.env file');

    // Write frontend .env file
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Created frontend/.env file');

    console.log('\n🎉 Setup Complete!\n');
    console.log('Your Google OAuth is now configured with:');
    console.log(`- Client ID: ${clientId.substring(0, 20)}...`);
    console.log(`- Client Secret: ${clientSecret.substring(0, 10)}...`);
    console.log(`- JWT Secret: ${jwtSecret.substring(0, 20)}...`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Restart your backend server: npm run dev:backend');
    console.log('2. Restart your frontend server: npm run dev:frontend');
    console.log('3. Test Google login at: http://localhost:3000/login');
    
    console.log('\n🔒 Security Notes:');
    console.log('- Keep your .env files secure and never commit them to version control');
    console.log('- Use different credentials for production');
    console.log('- Regularly rotate your JWT secret');

    console.log('\n📚 Documentation:');
    console.log('- See GOOGLE_OAUTH_SETUP.md for detailed instructions');
    console.log('- For production deployment, update redirect URIs in Google Cloud Console');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if .env files already exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (fs.existsSync(backendEnvPath) || fs.existsSync(frontendEnvPath)) {
  console.log('⚠️  Environment files already exist!');
  question('Do you want to overwrite them? (y/N): ').then(answer => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupGoogleOAuth();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  setupGoogleOAuth();
} 