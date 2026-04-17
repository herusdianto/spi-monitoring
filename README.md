# SPI Monitoring

A fullstack web application for monitoring SPI (Strategic Performance Indicator) data with Firebase authentication, Firestore database, and document generation capabilities (Word and Excel).

## Architecture

### Tech Stack

**Backend:**
- Node.js + Fastify (Fast, low-overhead web framework)
- Firebase Admin SDK (Firestore + Authentication)
- Joi (Validation)
- docx.js (Word document generation)
- exceljs (Excel document generation)

**Frontend:**
- Vue.js 3 (Composition API)
- Vuetify 3 (Material Design UI components)
- Pinia (State management)
- Vue Router
- Axios (HTTP client)
- Firebase Client SDK

**Bundling:**
- Webpack 5 with Vue Loader

### Project Structure

```
spi-monitoring/
├── backend/
│   ├── src/
│   │   ├── config/         # Firebase configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── plugins/       # Fastify plugins (auth)
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── validations/   # Joi schemas
│   │   └── index.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/        # Styles and static assets
│   │   ├── components/    # Reusable Vue components
│   │   ├── config/        # Firebase client config
│   │   ├── plugins/       # Vue plugins (Vuetify)
│   │   ├── router/        # Vue Router configuration
│   │   ├── services/      # API service layer
│   │   ├── store/         # Pinia stores (auth)
│   │   ├── views/         # Page components
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Entry point
│   ├── public/            # HTML template
│   ├── webpack.config.js  # Webpack configuration
│   └── package.json
└── package.json          # Root package (scripts)
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (see setup below)

### Installation

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install:all

# Or install individually
cd backend && npm install
cd ../frontend && npm install
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy Firebase config to `.env` files:
   
   **Backend** (`backend/.env`):
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```
   
   **Frontend** (`frontend/.env`):
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

### Running the Application

```bash
# Development (runs both backend and frontend)
npm run dev

# Or run separately:
npm run dev:backend  # Backend on http://localhost:3000
npm run dev:frontend # Frontend on http://localhost:8080

# Production build
npm run build
```

## Key Features

### Authentication
- Firebase Email/Password authentication
- JWT token management
- Protected routes

### CRUD Operations
- Create monitoring records
- Read/list records
- Update existing records
- Delete records

### Document Generation
- **Word (.docx)**: Single record export with formatted table
- **Excel (.xlsx)**: Single or bulk export with styled data

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/monitoring | Create record |
| GET | /api/monitoring | List records |
| GET | /api/monitoring/stats | Get statistics |
| GET | /api/monitoring/:id | Get single record |
| PUT | /api/monitoring/:id | Update record |
| DELETE | /api/monitoring/:id | Delete record |
| GET | /api/documents/word/:id | Generate Word |
| GET | /api/documents/excel | Export all (Excel) |
| GET | /api/documents/excel/:id | Export single (Excel) |

### Data Model (Firestore)

**Collection: `monitoring`**

```javascript
{
  id: string,           // Document ID
  userId: string,       // Owner Firebase UID
  spiName: string,      // SPI name (3-100 chars)
  description: string, // Optional description
  category: string,     // operational|financial|compliance|strategic
  status: string,      // draft|active|completed|archived
  priority: string,     // low|medium|high|critical
  responsible: string,  // Person in charge
  department: string,   // Department name
  startDate: string,   // ISO date
  endDate: string,     // ISO date (optional)
  metrics: {
    target: number,
    current: number,
    unit: string
  },
  notes: string,        // Optional notes
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## State Management (Pinia)

Why Pinia over Vuex:
- Simpler API (no mutations)
- TypeScript support
- Modular stores
- Smaller bundle size

## Next Improvements

1. **Security**: Add more comprehensive Firestore rules
2. **UI**: Add more form validation, loading states
3. **Export**: Add PDF generation support
4. **Filtering**: Advanced search and filtering on list page
5. **Charts**: Add chart visualizations on dashboard
6. **Deployment**: Docker support, CI/CD
7. **Testing**: Add unit and e2e tests
8. **PWA**: Make frontend a Progressive Web App