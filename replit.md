# Overview

This is an Algerian agricultural price aggregation platform designed to collect and display real-time prices of fruits and vegetables from markets across all 58 wilayas (provinces) of Algeria. The platform provides a comprehensive dashboard for monitoring price trends, comparing wholesale and retail prices, and tracking market data through an intelligent data collection system.

The application is built as a full-stack web platform with a React frontend and Express.js backend, featuring real-time price monitoring, multilingual support (Arabic/French), and data visualization capabilities for agricultural market analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and RTL (right-to-left) support for Arabic
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for JSON parsing and request logging
- **API Design**: RESTful endpoints for products, wilayas (provinces), and price data
- **Validation**: Zod schemas for request/response validation
- **Storage**: In-memory storage implementation with interface for easy database integration
- **Development**: Hot module replacement via Vite integration in development mode

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but not yet implemented - currently using in-memory storage)
- **Schema**: Well-defined database schema with products, wilayas, and prices tables
- **Migrations**: Drizzle Kit for database schema migrations

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic session infrastructure prepared with connect-pg-simple

## Component Architecture
- **Design System**: Comprehensive UI component library based on Shadcn/ui
- **Layout Components**: Header, mobile menu, and responsive navigation
- **Dashboard Components**: Statistics cards, search filters, price tables, charts, and system status
- **Accessibility**: ARIA labels and semantic HTML structure
- **Internationalization**: Arabic-first design with RTL text direction support

## Development and Build Pipeline
- **Development Server**: Vite dev server with HMR and TypeScript support
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Strict TypeScript configuration with path aliases
- **Code Quality**: ESLint and Prettier configurations (implied by project structure)

# External Dependencies

## Core Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **@radix-ui/**: Complete set of UI primitives for accessible components
- **tailwindcss**: Utility-first CSS framework
- **clsx** and **class-variance-authority**: Dynamic class name generation
- **date-fns**: Date manipulation and formatting
- **react-hook-form** and **@hookform/resolvers**: Form handling and validation

## Backend Dependencies
- **express**: Web application framework
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **zod**: Schema validation library
- **connect-pg-simple**: PostgreSQL session store

## Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database schema management and migrations
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tools

## UI and Styling
- **Font Integration**: Google Fonts (Inter for Latin text, Amiri for Arabic text)
- **Icons**: Font Awesome 6 for comprehensive icon support
- **Chart Library**: Prepared for Chart.js integration (referenced in price chart component)

## Database and Hosting
- **PostgreSQL**: Primary database (Neon serverless PostgreSQL)
- **Environment Variables**: DATABASE_URL for database connection
- **Deployment**: Configured for production deployment with environment-specific builds