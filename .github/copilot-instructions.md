# Copilot Instructions for SPL Jackpot Prizes

## Project Overview
This is a Next.js 15 app displaying Splinterlands card pack jackpot data. It shows card rarities, foil types, and mint statistics with real-time data from the Splinterlands API, using Material-UI for the interface.

## Architecture & Data Flow

### Core Data Sources
- **All Data**: Server actions in `app/actions/` using Next.js 16 caching with `"use cache"` directive
- **SPL API Client**: `lib/api/splApi.ts` - Direct Splinterlands API calls with retry logic

### Data Flow Pattern
1. Client components call server actions from `app/actions/`
2. Server actions use Next.js 16 built-in caching with `cacheLife()`
3. Data flows to client components for display and filtering
4. API routes in `/app/api/` serve as fallback/legacy endpoints

### Backend Services Architecture
- **Server Actions** (`app/actions/`): Cached data fetching with Next.js 16 `"use cache"` directive
- **SPL API Service** (`lib/api/splApi.ts`): Direct Splinterlands API client with axios and retry logic
- **Logger** (`lib/log/logger.server.ts`): Structured server-side logging with different levels
- **Caching**: Built-in Next.js 16 caching with `cacheLife()` - no external cache needed

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
- **Next.js 16 Built-in**: All caching handled by Next.js 16 `"use cache"` directive with `cacheLife()`
- **Cache Lifetimes**:
  - `cacheLife('seconds')` - Jackpot overview, CA Gold rewards (short-lived data)
  - `cacheLife('minutes')` - Mint history, balances, skins, draws (medium-lived data)
  - `cacheLife('hours')` - Card details (long-lived static data)
- **No External Cache**: Removed node-cache dependency - Next.js handles all caching automatically

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
- `app/actions/` - Server actions with Next.js 16 caching
- `app/hooks/` - Custom React hooks that call server actions
- `app/ca-mint-history/` - CA Mint History page route
- `app/jackpot-prizes/` - Jackpot Prizes page route
- `app/ranked-reward-draws/` - Ranked Reward Draws page route
- `app/frontier-reward-draws/` - Frontier Reward Draws page route
- `lib/api/` - Backend API service layer (SPL API client)
- `lib/log/` - Logging utilities

### Styling
- Material-UI (MUI) with dark theme and responsive design
- Emotion CSS-in-JS styling system
- MUI component library with custom theme configuration
- Responsive breakpoints handled by MUI Grid system

## External Dependencies
- **Next.js 16** - App Router with server actions and built-in caching
- **React 19** - Latest with concurrent features
- **Material-UI v5** - Component library with dark theme
- **@emotion/react & @emotion/styled** - CSS-in-JS styling
- **@mui/icons-material** - Icon library
- **axios** - HTTP client with retry logic
- **retry-axios** - Exponential backoff retry logic
- **TypeScript 5** - Strict type checking enabled

## Common Tasks
- Adding new API endpoints:
  1. Create function in `lib/api/splApi.ts` following existing patterns
  2. Create server action in `app/actions/` with `"use cache"` directive
  3. Use appropriate `cacheLife()` based on data volatility
- Cache management: Use Next.js 16 `cacheLife('seconds'|'minutes'|'hours')` in server actions
- Error handling: Use logger for structured error reporting
- UI components: All interactive components need 'use client' directive and MUI theming
- Type safety: Update interfaces in `app/types/` for API changes
- Styling: Use MUI's sx prop and theme system for consistent design
