# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Todo Task Management application.

## Step 1: Create Google OAuth Application

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing project
   - Give it a name like "Todo Task Management"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type

5. **Configure OAuth Consent Screen**
   - If prompted, configure the OAuth consent screen
   - Choose "External" user type
   - Fill in the required information:
     - App name: "Todo Task Management"
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`
   - Add test users if needed

6. **Configure OAuth Client**
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   
   - **Authorized redirect URIs:**
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://your-domain.com/api/auth/google/callback` (for production)

7. **Copy Credentials**
   - After creating, you'll get a Client ID and Client Secret
   - Save these securely

## Step 2: Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todo-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
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
```

**Replace the following values:**
- `your-google-client-id-here` with your actual Google Client ID
- `your-google-client-secret-here` with your actual Google Client Secret
- `your-super-secret-jwt-key-change-this-in-production` with a strong random string
- `your-email@gmail.com` and `your-app-password` with your email credentials (optional)

## Step 3: Frontend Environment (Optional)

If you want to configure the frontend API URL, create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Test the Setup

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Google Login:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google"
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you should be redirected back to the dashboard

## Troubleshooting

### Common Issues:

1. **"Google OAuth credentials not found"**
   - Make sure you created the `.env` file in the backend directory
   - Check that the environment variable names are correct
   - Restart the backend server after creating the `.env` file

2. **"Redirect URI mismatch"**
   - Make sure the redirect URI in Google Cloud Console matches exactly
   - Check for trailing slashes or protocol mismatches
   - The redirect URI should be: `http://localhost:5000/api/auth/google/callback`

3. **CORS errors**
   - Make sure `FRONTEND_URL` is set correctly in the backend `.env` file
   - Check that the frontend is running on the correct port

4. **"Invalid client" error**
   - Verify your Client ID and Client Secret are correct
   - Make sure you copied them from the right project in Google Cloud Console

### Security Notes:

- Never commit your `.env` file to version control
- Use different Client IDs for development and production
- Regularly rotate your JWT secret
- Use HTTPS in production

## Production Deployment

For production deployment:

1. **Update Google OAuth settings:**
   - Add your production domain to authorized origins
   - Add your production callback URL to authorized redirect URIs

2. **Update environment variables:**
   - Use production MongoDB URI
   - Use production JWT secret
   - Update callback URLs to use HTTPS

3. **Set up proper CORS:**
   - Update `FRONTEND_URL` to your production frontend URL

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify all environment variables are set correctly
4. Ensure Google OAuth is properly configured in Google Cloud Console 