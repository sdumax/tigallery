# The Interactive Gallery

A modern, interactive image gallery web application that allows users to browse stunning Unsplash images, view detailed information, and engage with content through comments and likes.

## 🌐 Live Demo

**Deployed URL:** Coming Soon

<!-- Replace with your actual deployed URL -->

## ✨ Features

### Core Features

- **Image Gallery**: Browse curated images from Unsplash API with infinite scroll
- **Image Details**: View high-resolution images with metadata, descriptions, and tags
- **Comments System**: Add and view comments on images with real-time updates
- **Search Functionality**: Search images by keyword with debounced input
- **Category Filtering**: Filter images by predefined categories

### Bonus Features

- **Authentication System**: User registration, login, and JWT-based auth
- **Like Functionality**: Like/unlike images with optimistic UI updates
- **Infinite Scrolling**: Seamless pagination for better UX
- **Advanced UI/UX**:
  - Mobile-first responsive design
  - BlurHash image placeholders for smooth loading
  - Loading skeletons and animations
  - Dark theme with Pinterest-inspired aesthetics

## 🛠️ Tech Stack

### Frontend

- **React 18** with **TypeScript**
- **TanStack Router** for client-side routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **React BlurHash** for image placeholders
- **Vite** for build tooling

### Backend

- **Node.js** with **Express**
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Axios** for API calls

### Database & External Services

- **PostgreSQL** database
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
   git clone <repository-url>
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
   yarn prisma migrate dev

   # Optional: Seed database with sample data
   yarn prisma db seed
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
   yarn preview
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

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
│   ├── lib/               # API client and utilities
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
└── generated/            # Auto-generated files (Prisma, etc.)
```

## 🔑 Key Implementation Details

### Authentication Flow

- JWT-based authentication with HTTP-only cookies (recommended for production)
- Protected routes requiring authentication
- User registration with password hashing
- Persistent login state management

### Data Management

- **TanStack Query** for efficient API state management
- Optimistic updates for likes and comments
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
- Image lazy loading and progressive enhancement
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

## 🔧 Development

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Modular component architecture

### Database Management

```bash
# View database in Prisma Studio
yarn prisma studio

# Reset database (development only)
yarn prisma migrate reset

# Generate new migration
yarn prisma migrate dev --name migration-name
```

## 📝 License

This project is built for educational purposes. Please ensure you comply with Unsplash API terms of service when using their images.

## 🙏 Acknowledgments

- **Unsplash** for providing beautiful, high-quality images
- **Vercel** for hosting and deployment platform
- The React and Node.js communities for excellent tooling and resources
