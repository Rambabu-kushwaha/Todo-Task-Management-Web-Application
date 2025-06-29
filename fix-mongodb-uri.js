#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing MongoDB Atlas Connection String\n');

try {
  // Correct MongoDB Atlas connection string with proper database name
  const mongoUri = 'mongodb+srv://prabin4444a:bGHIA1Gvabxgnmmh@todocluster.twfvhpv.mongodb.net/todo?retryWrites=true&w=majority&appName=TodoCluster';

  // Read existing backend .env
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  let backendEnvContent = '';
  
  if (fs.existsSync(backendEnvPath)) {
    backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
  }

  // Update MongoDB URI
  const updatedBackendEnv = backendEnvContent
    .replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoUri}`);

  // Write updated .env file
  fs.writeFileSync(backendEnvPath, updatedBackendEnv);

  console.log('✅ Fixed backend/.env with correct MongoDB Atlas connection string!');
  console.log(`📊 Database: ${mongoUri}`);
  
  console.log('\n🔄 Now restarting your application...');
  
  // Kill existing processes
  const { exec } = require('child_process');
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

} catch (error) {
  console.error('❌ Error updating MongoDB connection:', error);
} 