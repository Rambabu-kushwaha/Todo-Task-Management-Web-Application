#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🌐 Google OAuth Browser Setup Helper\n');

async function openGoogleCloudConsole() {
  console.log('📋 Opening Google Cloud Console...\n');
  
  const urls = [
    'https://console.cloud.google.com/',
    'https://console.cloud.google.com/apis/credentials',
    'https://console.cloud.google.com/apis/library/plus.googleapis.com'
  ];

  console.log('🔗 Opening helpful URLs in your browser:');
  urls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });

  // Try to open the browser (works on most systems)
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    command = 'start';
  } else if (platform === 'darwin') {
    command = 'open';
  } else {
    command = 'xdg-open';
  }

  // Open the main Google Cloud Console
  exec(`${command} "${urls[0]}"`, (error) => {
    if (error) {
      console.log('⚠️  Could not automatically open browser. Please manually visit:');
      console.log(urls[0]);
    } else {
      console.log('✅ Opened Google Cloud Console in your browser');
    }
  });

  console.log('\n📝 Step-by-step instructions:');
  console.log('1. Sign in to your Google account');
  console.log('2. Create a new project or select an existing one');
  console.log('3. Go to "APIs & Services" → "Library"');
  console.log('4. Search for "Google+ API" or "Google Identity" and enable it');
  console.log('5. Go to "APIs & Services" → "Credentials"');
  console.log('6. Click "Create Credentials" → "OAuth 2.0 Client IDs"');
  console.log('7. Choose "Web application" as the application type');
  console.log('8. Configure OAuth consent screen if prompted');
  console.log('9. Add these authorized redirect URIs:');
  console.log('   - http://localhost:5000/api/auth/google/callback');
  console.log('10. Copy the Client ID and Client Secret\n');

  const continueSetup = await question('Press Enter when you have your Client ID and Client Secret, or type "skip" to skip: ');
  
  if (continueSetup.toLowerCase() === 'skip') {
    console.log('Skipping automatic setup. You can run the setup script later with: npm run setup:google-oauth');
    rl.close();
    return;
  }

  // Run the main setup script
  console.log('\n🔄 Running Google OAuth setup...\n');
  exec('node setup-google-oauth.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Setup failed:', error);
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  });
}

// Check if we're on a supported platform
const platform = process.platform;
if (platform !== 'win32' && platform !== 'darwin' && platform !== 'linux') {
  console.log('⚠️  Automatic browser opening may not work on your platform.');
  console.log('Please manually visit: https://console.cloud.google.com/\n');
}

openGoogleCloudConsole(); 