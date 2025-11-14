# Gebeta - Delivery System

## Overview

Gebeta is a web-based delivery management system designed for restaurants. It provides real-time order tracking, menu management, and role-based access control for restaurant owners and managers. The application features live order notifications via WebSocket, interactive mapping with Leaflet, and comprehensive analytics through Recharts.

The system is built as a single-page application (SPA) with a focus on real-time updates and responsive design for both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 19.1.0** with functional components and hooks
- **Custom JSX pragma configuration** using Babel preset for React with classic runtime
- **State Management**: Zustand with persistence middleware for client-side state
- **Routing**: React Router DOM v7 for single-page navigation
- **Build Tool**: Vite 7 for fast development and optimized production builds

**Rationale**: React provides component reusability and efficient rendering. Zustand offers a lightweight alternative to Redux with simpler API and built-in persistence. Vite ensures fast hot module replacement during development.

### State Management Architecture
- **Zustand store** (`UseStore.js`) persists to sessionStorage
- **Centralized state** includes:
  - User authentication and profile data
  - Restaurant information
  - Orders with loading/error states
  - Menus with persistent caching
  - Foods organized by menuId
  - Notifications and real-time alerts
- **Cache strategy**: Menu and food data persist in sessionStorage, only refreshed on manual action or data modification

**Rationale**: SessionStorage persistence maintains state across page refreshes without server round-trips. Menu/food caching reduces API calls for frequently accessed data.

### Real-time Communication
- **Socket.IO client** v4.8.1 for WebSocket connections
- **OrderPollingService** singleton class manages WebSocket lifecycle
- **Connection requirements**: 
  - User must be Manager role
  - Valid authentication token
  - Restaurant ID present
  - User logged in
- **Fallback polling** mechanism with 3-second minimum interval
- **Audio notifications** for new orders using HTML5 audio

**Rationale**: WebSocket provides instant order updates without polling overhead. Singleton pattern prevents multiple connections. Polling fallback ensures reliability when WebSocket unavailable.

### API Communication
- **Axios** v1.10.0 for HTTP requests
- **Custom HTTP service layer** with GET, POST, PATCH, DELETE methods
- **Base API URL**: `https://gebeta-delivery1.onrender.com/api/v1`
- **Authentication**: JWT token stored in localStorage
- **Custom React hook** (`UseHttp.js`) for fetch-based requests with loading/error states

**Rationale**: Axios provides interceptors and better error handling. Custom service layer abstracts API calls. Separation of concerns between axios service and fetch hook provides flexibility.

### Styling and UI
- **TailwindCSS** v3.4.17 for utility-first styling
- **Custom design system** with predefined colors:
  - Primary: Black (#000000)
  - Role-specific colors (owner, manager)
  - Status colors (success, warning, error, info)
- **Responsive design** using Tailwind breakpoints
- **Custom animations** for notifications (slide-in, bounce, pulse)
- **TailwindCSS Motion** plugin for advanced animations
- **Scrollbar hide** plugin for cleaner UI

**Ratwind provides rapid prototyping and consistent design. Custom color palette maintains brand identity. Animation utilities enhance user experience for real-time notifications.

### Mapping and Geolocation
- **Leaflet** v1.9.4 for interactive maps
- **React-Leaflet** v5.0.0 for React integration
- Location-based features for delivery tracking

**Rationale**: Leaflet is lightweight and open-source alternative to Google Maps. React-Leaflet provides declarative API matching React patterns.

### Data Visualization
- **Recharts** v3.0.2 for analytics dashboards
- Interactive charts for order statistics and trends

**Rationale**: Recharts offers responsive, composable charts with React-friendly API.

### Media Capture
- **React-Webcam** v7.2.0 for camera integration
- Likely used for order verification or driver identification

**Rationale**: Browser-based media capture eliminates native app requirement.

### Icon System
- **Lucide React** v0.525.0 for consistent iconography
- Tree-shakeable SVG icons reduce bundle size

**Rationale**: Lucide provides modern, customizable icons with excellent React support.

### Development Tools
- **ESLint** with React hooks and refresh plugins
- **Locator.js** for component debugging in browser
- **Babel configuration** for JSX transformation
- **PostCSS** with Autoprefixer for CSS processing

**Rationale**: ESLint enforces code quality. Locator.js speeds up development by allowing click-to-code navigation.

### Build and Deployment
- **Vite configuration**:
  - Development: Port 5000 with HMR over WSS (clientPort 443 for Replit proxy)
  - Production: Optimized bundle with manual chunks disabled
  - 1000kb chunk size warning limit
  - Host binding: 0.0.0.0 for Replit environment
- **Replit deployment** with autoscale configuration
  - Build command: `npm run build`
  - Start command: `npm run preview` (serves production build)
- **Development workflow**: `npm run dev` on port 5000

**Rationale**: Vite provides faster builds than webpack. WSS HMR with port 443 enables hot reload through Replit's HTTPS proxy. Autoscale deployment suits stateless SPA architecture.

### Role-Based Access Control
- **User roles**: Owner, Manager
- **Role-specific features** and UI components
- **Authentication flow** with first-login tracking
- **Session management** with token expiration handling

**Rationale**: Role-based system allows different permission levels. First-login tracking enables onboarding flows.

## External Dependencies

### Backend API
- **Base URL**: `https://gebeta-delivery1.onrender.com`
- **API Version**: v1
- **Endpoints**:
  - `/api/v1/orders/restaurant` - Order management
  - Authentication endpoints (inferred)
  - Menu and food management endpoints (inferred)
- **WebSocket**: Socket.IO server on same domain
- **Authentication**: JWT Bearer tokens

### Third-Party Services
- **Replit** - Frontend hosting and deployment platform
- **Render.com** - Backend API hosting (based on URL)

### Browser APIs
- **SessionStorage** - State persistence
- **LocalStorage** - Token storage
- **MediaDevices API** - Webcam access
- **WebSocket API** - Real-time communication
- **Audio API** - Notification sounds

### Development Services
- **Codacy** - Code quality and security analysis (GitHub integration)
- **LocatorJS** - Development tooling for component navigation

### Font Services
- **Google Fonts** (inferred):
  - Poppins (default sans-serif)
  - Noto Sans (fallback)

### CSS Framework Plugins
- **tailwind-scrollbar-hide** - Enhanced scrollbar styling
- **tailwindcss-motion** - Animation utilities