#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Frontend API URL Configuration\n');

try {
  // Create frontend .env file with correct API URL
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  const frontendEnvContent = `# API Configuration
VITE_API_URL=http://localhost:5000
`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env with correct API URL: http://localhost:5000');
  
  console.log('\n🔄 Please restart your frontend development server:');
  console.log('1. Stop the current frontend (Ctrl+C)');
  console.log('2. Run: npm run dev:frontend');
  console.log('3. Or restart the full app: npm run dev');
  
  console.log('\n📋 This will fix the 404 errors for:');
  console.log('- Registration and Login');
  console.log('- Google OAuth login');
  console.log('- All API calls');

} catch (error) {
  console.error('❌ Error fixing API URL:', error.message);
  process.exit(1);
} 