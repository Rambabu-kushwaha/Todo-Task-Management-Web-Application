#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔐 Update Google OAuth Credentials\n');

async function updateGoogleOAuth() {
  try {
    console.log('📋 Instructions for getting Google OAuth credentials:\n');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Select your project (black-network-464412-j6)');
    console.log('3. Go to "APIs & Services" → "Credentials"');
    console.log('4. Click "Create Credentials" → "OAuth 2.0 Client IDs"');
    console.log('5. Choose "Web application"');
    console.log('6. Add these authorized redirect URIs:');
    console.log('   - http://localhost:5000/api/auth/google/callback');
    console.log('   - http://localhost:3000/auth/callback');
    console.log('7. Copy the Client ID and Client Secret\n');

    const clientId = await question('Enter your Google OAuth Client ID: ');
    const clientSecret = await question('Enter your Google OAuth Client Secret: ');

    if (!clientId || !clientSecret) {
      console.log('❌ Client ID and Client Secret are required!');
      return;
    }

    // Read existing backend .env
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    let backendEnvContent = '';
    
    if (fs.existsSync(backendEnvPath)) {
      backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
    }

    // Update Google OAuth credentials
    const updatedBackendEnv = backendEnvContent
      .replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID=${clientId}`)
      .replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET=${clientSecret}`);

    // Write updated .env file
    fs.writeFileSync(backendEnvPath, updatedBackendEnv);

    console.log('\n✅ Updated backend/.env with Google OAuth credentials!\n');
    
    console.log('🔄 Restart the backend server to apply changes:\n');
    console.log('1. Stop the current backend (Ctrl+C)');
    console.log('2. Run: npm run dev:backend');
    console.log('3. Test Google login at: http://localhost:3000\n');

  } catch (error) {
    console.error('❌ Error during update:', error);
  } finally {
    rl.close();
  }
}

updateGoogleOAuth(); 