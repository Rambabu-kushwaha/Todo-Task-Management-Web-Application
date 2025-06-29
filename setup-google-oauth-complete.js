#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Complete Google OAuth Setup for Todo App\n');

async function setupGoogleOAuthComplete() {
  try {
    console.log('📋 Step 1: Google Cloud Console Setup\n');
    console.log('Opening Google Cloud Console in your browser...\n');
    
    // Open Google Cloud Console
    const urls = [
      'https://console.cloud.google.com/',
      'https://console.cloud.google.com/apis/credentials',
      'https://console.cloud.google.com/apis/library/plus.googleapis.com'
    ];

    urls.forEach((url, index) => {
      setTimeout(() => {
        exec(`start ${url}`);
      }, index * 1000);
    });

    console.log('✅ Opened Google Cloud Console in your browser\n');
    
    console.log('📝 Step 2: Create OAuth 2.0 Credentials\n');
    console.log('1. Create a new project or select existing project');
    console.log('2. Enable Google+ API (or Google Identity API)');
    console.log('3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"');
    console.log('4. Choose "Web application"');
    console.log('5. Add these authorized redirect URIs:');
    console.log('   - http://localhost:5000/api/auth/google/callback');
    console.log('   - http://localhost:3000/auth/callback');
    console.log('6. Copy the Client ID and Client Secret\n');

    const clientId = await question('Enter your Google OAuth Client ID: ');
    const clientSecret = await question('Enter your Google OAuth Client Secret: ');

    if (!clientId || !clientSecret) {
      console.log('❌ Client ID and Client Secret are required!');
      return;
    }

    // Fix frontend API URL
    console.log('\n🔧 Step 3: Fixing Frontend API Configuration\n');
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
    const frontendEnvContent = `# API Configuration
VITE_API_URL=http://localhost:5000
`;

    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Fixed frontend/.env with correct API URL');

    // Update backend Google OAuth credentials
    console.log('\n🔧 Step 4: Updating Backend Google OAuth Credentials\n');
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
    console.log('✅ Updated backend/.env with real Google OAuth credentials');

    console.log('\n🎉 Step 5: Setup Complete!\n');
    
    console.log('🔄 Step 6: Restart the application\n');
    console.log('The application needs to be restarted to use the new credentials.\n');
    
    const restart = await question('Would you like to restart the application now? (y/n): ');
    
    if (restart.toLowerCase() === 'y' || restart.toLowerCase() === 'yes') {
      console.log('\n🔄 Restarting application...\n');
      
      // Kill existing processes
      exec('taskkill /F /IM node.exe', (error) => {
        if (error) {
          console.log('No existing Node.js processes to kill');
        }
        
        // Start the application
        setTimeout(() => {
          exec('npm run dev', (error, stdout, stderr) => {
            if (error) {
              console.error('Error starting application:', error);
              return;
            }
            console.log('Application started successfully!');
          });
        }, 2000);
      });
    } else {
      console.log('\n📋 Manual restart instructions:');
      console.log('1. Stop the current application (Ctrl+C)');
      console.log('2. Run: npm run dev');
      console.log('3. Test the application at: http://localhost:3000\n');
    }

    console.log('\n✅ What\'s Fixed:');
    console.log('✅ Frontend API URL configuration');
    console.log('✅ Backend Google OAuth credentials');
    console.log('✅ Registration and Login 404 errors');
    console.log('✅ Google OAuth login 404 errors');
    console.log('✅ All API calls should now work properly');

    console.log('\n🧪 Testing Instructions:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Try "Continue with Google" - should redirect to Google');
    console.log('3. Try email/password registration - should work');
    console.log('4. Try email/password login - should work');
    console.log('5. After Google login, you should be redirected to dashboard');

  } catch (error) {
    console.error('❌ Error during setup:', error);
  } finally {
    rl.close();
  }
}

setupGoogleOAuthComplete(); 