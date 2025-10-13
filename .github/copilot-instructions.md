# Copilot Instructions for SPL Jackpot Prizes

## Project Overview
This is a Next.js 15 app displaying Splinterlands card pack jackpot data. It shows card rarities, foil types, and mint statistics with real-time data from the Splinterlands API, using Material-UI for the interface.

## Architecture & Data Flow

### Core Data Sources
- **Jackpot Data**: `fetchPackJackpotOverview()` from `lib/api/splApi.ts`
- **Card Details**: `fetchCardDetails()` from `lib/api/splApi.ts`
- **Mint History**: `fetchMintHistory()` from `lib/api/splApi.ts`

### Data Flow Pattern
1. `app/page.tsx` uses SPL API service functions for server-side data fetching
2. Passes data to `ClientCardGrid` component for client-side filtering
3. `Card` components fetch individual mint histories via `/api/mint_history` route
4. API route now uses SPL API service with NodeCache-based caching

### Backend Services Architecture
- **SPL API Service** (`lib/api/splApi.ts`): Centralized Splinterlands API client with axios and retry logic
- **Cache Server** (`lib/cache/cacheServer.ts`): NodeCache-based caching with TTL management
- **Logger** (`lib/log/logger.server.ts`): Structured server-side logging with different levels

### Key Type Definitions
- `PackJackpotCard` - jackpot overview data with foil statistics
- `CardDetail` - complete card information including rarity and stats
- `MintHistoryResponse` - individual card mint data and ownership history

## Component Architecture

### Server Components
- `app/page.tsx` - Landing page with navigation links
- `app/ca-mint-history/page.tsx` - CA Mint History page using SPL API service
- `app/jackpot-prizes/page.tsx` - Jackpot Prizes overview page
- Uses Promise.all for parallel API calls with proper error handling

### Client Components (all marked 'use client')
- `Navigation` - MUI AppBar with navigation between pages
- `ClientCardGrid` - Main container with MUI responsive grid and rarity filtering (used by CA Mint History)
- `JackpotPrizesGrid` - Table-based overview for jackpot statistics
- `Card` - Individual card display using MUI Card components with async mint data loading
- `RarityFilter` - MUI ToggleButtonGroup for rarity selection (1=Common, 2=Rare, 3=Epic, 4=Legendary)
- `Modal` - MUI Dialog component for mint history details with proper theming
- `ThemeProvider` - Client-side MUI theme configuration

## Project-Specific Patterns

### Page Structure
- **Landing Page** (`/`): Dashboard with links to main features
- **CA Mint History** (`/ca-mint-history`): Detailed card view with mint history modals
- **Jackpot Prizes** (`/jackpot-prizes`): Table overview of jackpot statistics
- **Navigation**: Persistent AppBar with active page highlighting

### Foil Type Handling
```typescript
const FOIL_TYPES = [3, 2, 4] // Black Foil, Gold Foil Arcane, Black Foil Arcane
```
- Foil 3 shows total only, others show minted/total ratio
- Each foil type requires separate API call to mint_history

### Caching Strategy
- **NodeCache**: TTL-based caching with automatic cleanup
- **Card Details**: 1-hour cache (3600 seconds)
- **Jackpot Data**: 1-hour cache (3600 seconds)
- **Mint History**: 30-minute cache (1800 seconds)
- **Cache Keys**: `card_details`, `pack_jackpot_overview_{edition}`, `mint_history_{foil}_{cardId}`

### Error Handling & Retry Logic
- **Exponential backoff**: 10 retries with 1000ms base delay
- **Status codes**: Retries on 429 (rate limit) and 5xx errors
- **Logging**: Structured logging for all API calls and errors
- **Graceful degradation**: Proper error responses with status codes

### Image Loading
- Card images: `https://d36mxiodymuqjm.cloudfront.net/cards_v2.2/{cardName}.jpg`
- Rarity icons: `https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_{type}_new.svg`
- Next.js Image component with CloudFront CDN configured in `next.config.ts`

## Development Workflow

### Commands
```bash
npm run dev    # Development server on localhost:3000
npm run build  # Production build
npm run lint   # ESLint with Next.js config
```

### File Organization
- `app/types/` - TypeScript interfaces for API responses
- `app/components/` - MUI-based UI components (all client-side)
- `app/ca-mint-history/` - CA Mint History page route
- `app/jackpot-prizes/` - Jackpot Prizes page route
- `app/api/` - Next.js API routes using backend services
- `lib/api/` - Backend API service layer
- `lib/cache/` - Caching infrastructure
- `lib/log/` - Logging utilities

### Styling
- Material-UI (MUI) with dark theme and responsive design
- Emotion CSS-in-JS styling system
- MUI component library with custom theme configuration
- Responsive breakpoints handled by MUI Grid system

## External Dependencies
- **Next.js 15** - App Router with server/client component pattern
- **React 19** - Latest with concurrent features
- **Material-UI v5** - Component library with dark theme
- **@emotion/react & @emotion/styled** - CSS-in-JS styling
- **@mui/icons-material** - Icon library
- **axios** - HTTP client with retry logic
- **node-cache** - In-memory caching
- **retry-axios** - Exponential backoff retry logic
- **TypeScript 5** - Strict type checking enabled

## Common Tasks
- Adding new API endpoints: Create functions in `lib/api/splApi.ts` following existing patterns
- Cache management: Use `cacheServer` singleton with appropriate TTL values
- Error handling: Use logger for structured error reporting
- UI components: All interactive components need 'use client' directive and MUI theming
- Type safety: Update interfaces in `app/types/` for API changes
- Styling: Use MUI's sx prop and theme system for consistent design