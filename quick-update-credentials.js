#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Updating Google OAuth Credentials\n');

try {
  // Your real Google OAuth credentials
  const clientId = '28445060000-m2lhonvf635stnqbsu70usc743b254md.apps.googleusercontent.com';
  const clientSecret = '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';

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

  console.log('✅ Updated backend/.env with real Google OAuth credentials!');
  console.log(`✅ Client ID: ${clientId.substring(0, 20)}...`);
  console.log(`✅ Client Secret: ${clientSecret.substring(0, 10)}...`);
  
  console.log('\n🔄 Please restart the backend server to apply changes:');
  console.log('1. Stop the current backend (Ctrl+C)');
  console.log('2. Run: npm run dev:backend');
  console.log('3. Or restart the full app: npm run dev');
  
  console.log('\n🧪 Test Google OAuth:');
  console.log('1. Go to http://localhost:3000');
  console.log('2. Click "Continue with Google"');
  console.log('3. You should now be redirected to Google\'s OAuth consent screen');
  console.log('4. After authorization, you\'ll be redirected to the dashboard');

} catch (error) {
  console.error('❌ Error updating credentials:', error);
  process.exit(1);
} 