#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔧 MongoDB Atlas Setup Helper\n');

async function setupMongoDB() {
  try {
    console.log('Please provide your MongoDB Atlas connection details:');
    
    const username = await question('MongoDB Username: ');
    const password = await question('MongoDB Password: ');
    const cluster = await question('Cluster URL (e.g., cluster.mongodb.net): ');
    const database = await question('Database name (default: todo): ') || 'todo';
    
    // Build the connection string
    const mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
    
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

    console.log('\n✅ Successfully updated backend/.env with your MongoDB Atlas connection!');
    console.log('📊 Database configured for:', database);
    
    console.log('\n🔄 Next steps:');
    console.log('1. Make sure your IP is whitelisted in MongoDB Atlas');
    console.log('2. Restart your application: npm run dev');
    console.log('3. Test the connection at: http://localhost:3000');
    
    rl.close();

  } catch (error) {
    console.error('❌ Error setting up MongoDB:', error);
    rl.close();
  }
}

setupMongoDB(); 