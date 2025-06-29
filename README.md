# 🚀 Todo Task Management App

A full-stack, real-time task management application built with React, Node.js, and MongoDB Atlas. Features Google OAuth authentication, real-time updates via WebSockets, and a modern responsive UI.

## ✨ Features

### 🔐 Authentication
- **Google OAuth 2.0** integration for seamless login/signup
- JWT-based session management
- Secure token storage and refresh

### 📋 Task Management
- **CRUD operations** for tasks with full user permissions
- **Real-time updates** via WebSocket connections
- **Task sharing** with other users via email
- **Priority levels**: Low, Medium, High, Urgent
- **Status tracking**: Todo, In Progress, Completed, Archived
- **Due date management** with overdue detection
- **Tags and subtasks** support
- **Estimated time** tracking

### 🎨 User Interface
- **Responsive design** for desktop and mobile
- **Dark/Light theme** support
- **Modern UI** with Tailwind CSS
- **Real-time notifications** and toast messages
- **Loading states** and error boundaries
- **Pagination** for large task lists

### 🔍 Advanced Features
- **Search and filtering** by status, priority, tags, and due date
- **Sorting** by multiple criteria
- **Task statistics** dashboard
- **Real-time collaboration** with shared tasks
- **Input validation** and error handling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express.js    │    │ • MongoDB Atlas │
│ • TypeScript    │    │ • Passport.js   │    │ • Mongoose ODM  │
│ • Vite          │    │ • Socket.io     │    │ • JWT Auth      │
│ • Tailwind CSS  │    │ • JWT           │    │                 │
│ • React Hot     │    │ • Rate Limiting │    │                 │
│   Toast         │    │ • Validation    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│   WebSocket     │
                        │   (Real-time)   │
                        │                 │
                        │ • Task Updates  │
                        │ • Notifications │
                        │ • Live Status   │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (free tier available)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd todo-task-management
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 3. Environment Setup

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Update the `.env` file with your credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```bash
cd frontend
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Client Secret to backend `.env`

### 5. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster (M0 Free tier)
3. Create a database user
4. Get your connection string
5. Add your IP to the whitelist
6. Update `MONGODB_URI` in backend `.env`

### 6. Run the Application

```bash
# From the root directory
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000).

## 📱 Usage

### Authentication
1. Click "Continue with Google" to sign in
2. Grant necessary permissions
3. You'll be redirected to the dashboard

### Creating Tasks
1. Click "New Task" button
2. Fill in task details:
   - Title (required)
   - Description (optional)
   - Status and Priority
   - Due Date (optional)
3. Click "Create Task"

### Managing Tasks
- **Edit**: Click the edit icon on any task
- **Delete**: Click the delete icon (with confirmation)
- **Status Update**: Use the dropdown to change status
- **Share**: Add other users by email (they must be registered)

### Real-time Features
- Tasks update in real-time across all connected users
- Status changes are reflected immediately
- Shared tasks appear instantly for all collaborators

## 🛠️ Development

### Project Structure
```
todo-task-management/
├── backend/
│   ├── src/
│   │   ├── config/          # Passport, database config
│   │   ├── middleware/      # Auth, validation middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── socket/          # WebSocket handlers
│   │   └── server.js        # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── lib/             # API utilities
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

### Available Scripts

#### Root Directory
```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Start only frontend
npm run dev:backend  # Start only backend
npm run build        # Build for production
```

#### Backend
```bash
npm run dev          # Start with nodemon
npm start           # Start production server
npm test            # Run tests
```

#### Frontend
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering/pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `POST /api/tasks/:id/share` - Share task with user
- `DELETE /api/tasks/:id/share/:userId` - Remove shared user
- `POST /api/tasks/:id/comments` - Add comment
- `GET /api/tasks/stats/overview` - Get task statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users
- `GET /api/users/shared-tasks` - Get shared tasks

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Environment Variables for Production
```env
# Backend
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
FRONTEND_URL=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-backend-domain.com
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data
- **MongoDB Injection Protection** via Mongoose
- **XSS Protection** with proper content sanitization

## 📊 Performance Optimizations

- **Pagination** for large datasets
- **Database Indexing** for faster queries
- **WebSocket** for real-time updates
- **Lazy Loading** for components
- **Optimized Images** and assets
- **Caching** strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎥 Demo Video

[Loom Demo Video](https://www.loom.com/share/your-demo-video-id)

## 🏆 Hackathon Submission

This project was built for the hackathon organized by [Kato Maran](https://www.katomaran.com).

### Assumptions Made

1. **User Registration**: Users can register with email/password or Google OAuth
2. **Task Sharing**: Tasks can be shared with other registered users via email
3. **Real-time Updates**: All task changes are reflected in real-time across all connected users
4. **Mobile Responsiveness**: The app works seamlessly on both desktop and mobile devices
5. **Offline Support**: Basic offline functionality with error boundaries
6. **Data Persistence**: All data is stored in MongoDB Atlas for reliability
7. **Security**: JWT tokens are used for authentication with proper expiration
8. **Scalability**: The architecture supports horizontal scaling

### Technical Decisions

1. **React + TypeScript**: For type safety and better developer experience
2. **Node.js + Express**: For robust backend API development
3. **MongoDB Atlas**: For cloud-hosted, scalable database
4. **Socket.io**: For real-time bidirectional communication
5. **Tailwind CSS**: For rapid UI development and consistency
6. **Vite**: For fast development and optimized builds
7. **Passport.js**: For OAuth authentication
8. **JWT**: For stateless authentication

### Future Enhancements

- [ ] Email notifications for task assignments
- [ ] Calendar integration
- [ ] File attachments for tasks
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Team workspaces
- [ ] Time tracking
- [ ] Kanban board view
- [ ] API rate limiting dashboard
- [ ] Automated testing suite

---

**This project is a part of a hackathon run by [https://www.katomaran.com](https://www.katomaran.com)** 