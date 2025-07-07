# The Interactive Gallery(Tigallery)

A modern, interactive image gallery web app that allows you to browse stunning Unsplash images, view detailed information, and engage with content through comments and likes. Design is inspired by pinterest

## 🌐 Live Demo

**Deployed URL:** [TiGallery](https://tigallery.onrender.com/)

## ✨ Features

### Core Features

- **Image Gallery**: Browse curated images from Unsplash API with infinite scroll
- **Image Details**: View high-resolution images with metadata, descriptions, and tags
- **Comments System**: Add and view comments on images with real-time updates
- **Search Functionality**: Search images by keyword with debounced input
- **Category Filtering**: Filter images by predefined categories

### Extras

- **Authentication System**: User registration, login, and JWT-based auth
- **Like Functionality**: Like/unlike images with optimistic UI updates
- **Advanced UI/UX**:
  - Mobile-first responsive design
  - BlurHash image placeholders for smooth loading
  - Loading skeletons and animations
  - Dark theme with Pinterest-inspired aesthetics

## 🛠️ Tech Stack

### Frontend

- **React 19** with **TypeScript**
- **TanStack Router** for client-side routing
- **TanStack Query** for lighting fast data fetching and caching
- **Tailwind CSS** for styling
- **React BlurHash** for image placeholders
- **Vite** for build tooling
- **Axios** for API calls

### Backend

- **Node.js** with **Express**
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Axios** for API calls

### Database & External Services

- **PostgreSQL** database (prisma postgres)
- **Prisma** as ORM and query builder
- **Unsplash API** for image data

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Unsplash API access key

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/sdumax/tigallery.git
   cd the-interactive-gallery
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory using the sample below:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/gallery_db"

   # JWT Secret (use a strong, random string)
   JWT_SECRET="your-super-secret-jwt-key-here"

   # Unsplash API
   UNSPLASH_ACCESS_KEY="your-unsplash-access-key"

   # Optional: Development settings
   NODE_ENV="development"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   yarn prisma generate

   # Run database migrations
   yarn prisma
   ```

### Running the Application

1. **Development Mode**

   ```bash
   yarn dev
   ```

   This starts both frontend and backend in development mode.

2. **Production Build**

   ```bash
   yarn build
   yarn start
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3000/api`

## 🚀 Deploy to Render

### Quick Deploy (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. **Fork this repository** to your GitHub account

2. **Click "Deploy to Render"** or:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect the `render.yaml` configuration

3. **Set Environment Variables**:

   **Required Manual Setup:**

   ```bash
   UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here
   DATABASE_URL=postgresql://... 
   JWT_SECRET=random-secret  
   ```

   ⚠️ **Important**: You MUST set the Environment variables manually in Render's environment variables section.

4. **Deploy**: Click "Apply"


## 📁 Project Structure

```
src/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   ├── pages/         # Page components
│   │   ├── svgIcons/      # SVG icon components
│   │   └── ui/            # Generic UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Facade
│   ├── routes/            # TanStack Router routes
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend Express application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── prisma/           # Database schema and client
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Server utilities
└── generated/            # Auto-generated files (Prisma)
```

## 🔑 Key Implementation Details

### Authentication Flow

- JWT-based authentication with HTTP-only cookies (recommended for production)
- Protected routes requiring authentication
- User registration with password hashing
- Persistent login state management

### Data Management

- **TanStack Query** for efficient API state management
- Optimistic updates for likes
- Automatic cache invalidation and refetching
- Infinite query for pagination

### Image Handling

- **BlurHash** integration for progressive image loading
- Responsive image loading with different sizes
- Crossfade animations for smooth image transitions
- Error handling for failed image loads

### Real-time Features

- Optimistic UI updates for immediate feedback
- Real-time comment and like count updates
- Debounced search input for better performance

### Performance Optimizations

- Code splitting with lazy loading
- Image lazy loading
- Efficient infinite scrolling implementation
- Memoized components and callbacks

## 🧪 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Images

- `GET /api/images` - Get paginated images
- `GET /api/images/:id` - Get single image details
- `GET /api/images/search` - Search images

### Comments

- `GET /api/images/:id/comments` - Get image comments
- `POST /api/images/:id/comments` - Add comment (auth required)

### Likes

- `GET /api/images/:id/likes` - Get image likes
- `POST /api/images/:id/likes` - Toggle like (auth required)

