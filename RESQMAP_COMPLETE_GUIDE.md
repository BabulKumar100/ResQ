# ResQMap - Emergency Rescue Coordination Platform
## Complete Implementation Guide

![ResQMap Logo](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RESQMAPKO-eZTYR9rGICNQYmYDMiprTziSIHPNWv.jpeg)

---

## Overview
ResQMap is a real-time emergency rescue coordination platform built with React 18 + TypeScript + Leaflet + PostgreSQL + PostGIS. It enables multiple agencies (police, fire, medical, NGO) to coordinate rescue operations with real-time incident tracking, danger zone management, and resource optimization.

---

## Architecture

### Frontend Stack
- **React 18** + TypeScript (type-safe components)
- **Tailwind CSS** for dark-mode-first styling
- **Leaflet.js** + OpenStreetMap (free, no API key required)
- **Next.js 16** with App Router
- **Vercel deployment**

### Backend Stack
- **Node.js** (Next.js API routes)
- **PostgreSQL + PostGIS** (spatial queries)
- **Redis** (real-time state + pub/sub)
- **Socket.io** (WebSocket for live updates)

### DevOps
- **Docker Compose** (local development)
- **Kubernetes** (production scaling)
- **GitHub Actions** (CI/CD)

---

## Implemented Features

### 1. ✅ SOS Beacon System
**File:** `hooks/useSOSBeacon.ts`
- One-tap SOS button with GPS auto-capture
- Auto-escalation after 3 minutes if no responder
- Animated red pulse on map
- Works on 2G (minimal payload)

**Usage:**
```typescript
const { beacon, activateBeacon, deactivateBeacon, isEscalated } = useSOSBeacon()

// Activate SOS
await activateBeacon('Medical emergency at downtown clinic')

// Check escalation
if (isEscalated) {
  // Alert next available unit
}
```

### 2. ✅ Offline Map Tiles
**File:** `hooks/useOfflineMap.ts`
- Service Worker caches last 3 visited regions
- IndexedDB queue for offline data
- Auto-sync when connection restored
- Shows offline status banner

**Usage:**
```typescript
const { cacheRegion, syncData, isOnline } = useOfflineMap()

// Cache a region before field ops
await cacheRegion(mapBounds)

// Sync when reconnected
if (isOnline) {
  await syncData()
}
```

### 3. ✅ Danger Zone Heatmap
**File:** `hooks/useDangerZones.ts`
- Draw polygons for flood/fire/collapse zones
- Color-coded severity (red/orange/yellow)
- Auto-warn rescuers if route passes through zone
- Historical data from PostGIS

**Usage:**
```typescript
const { zones, checkRouteIntersection } = useDangerZones()

// Check if route is safe
const dangerZonesOnRoute = checkRouteIntersection(routeCoordinates)
if (dangerZonesOnRoute.length > 0) {
  // Warn rescuer: "Route passes through flood zone"
}
```

### 4. ✅ ResQMap Dashboard
**File:** `components/ResQMapDashboard.tsx`
- Dark-mode-first emergency operations UI
- Floating incident list (left sidebar)
- Incident details panel (right sidebar)
- Status bar (top): active incidents, connected units, offline mode
- Bottom controls with keyboard shortcuts
- Emergency SOS button (floating, animated)

**Color Coding:**
- Red: Critical incidents
- Orange: High severity
- Yellow: Medium/caution
- Green: Safe/resolved
- Blue: Info/units

### 5. ✅ API Endpoints

#### Incidents
```bash
GET  /api/incidents              # Fetch all active incidents
POST /api/incidents              # Create new incident
PUT  /api/incidents/:id          # Update incident status
```

#### Danger Zones
```bash
GET  /api/danger-zones           # Fetch heatmap data
POST /api/danger-zones           # Create danger zone
PUT  /api/danger-zones/:id       # Update zone
DELETE /api/danger-zones/:id     # Remove zone
```

#### SOS Alerts (existing)
```bash
POST /api/sos-alerts             # Broadcast SOS
GET  /api/sos-alerts             # Fetch active SOSes
PUT  /api/sos-alerts/:id         # Update SOS status
```

---

## To-Do: Remaining Features (6-10)

### 6. Multi-Agency Command Board
**Status:** Design phase
- Shared dashboard for police/fire/medical
- Color-coded unit markers per agency
- Role-based layer visibility
- Live incident chat sidebar
- Incident Commander controls

**Estimated Effort:** 16 hours

### 7. Survivor Tracker with QR Codes
**Status:** Design phase
- QR wristband generation
- Field team scanner (PWA camera)
- Survivor status workflow
- Batch CSV import
- Map marker status updates

**Estimated Effort:** 12 hours

### 8. Drone Live Feed Overlay
**Status:** Design phase
- RTMP/WebRTC streaming embed
- Drone GPS position on map
- Manual pin-drop from video
- Multi-drone selector panel

**Estimated Effort:** 20 hours

### 9. AI Incident Prediction
**Status:** Design phase
- Python FastAPI prediction service
- Historical PostGIS data → ML model
- Risk zone overlay with confidence %
- Daily cron job refresh

**Estimated Effort:** 18 hours

### 10. Resource Inventory Map
**Status:** Design phase
- Draggable unit/vehicle markers
- Vehicle status: fuel, crew, equipment
- Dispatcher drag-to-assign
- Auto-alert: battery/fuel < 20%

**Estimated Effort:** 14 hours

---

## Configuration

### Constants (`lib/resqmap-config.ts`)
All settings are centralized:
```typescript
- RESQMAP_CONFIG.COLORS          # Dark mode palette
- RESQMAP_CONFIG.MAP             # Leaflet defaults
- RESQMAP_CONFIG.SOS             # Beacon timeouts
- RESQMAP_CONFIG.ROUTING         # OSRM settings
- RESQMAP_CONFIG.CRON_INTERVALS  # Automation timings
```

### Environment Variables
```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=

# Maps (OSM is free, no key needed)
# Optional: Mapbox token for advanced features
NEXT_PUBLIC_MAPBOX_TOKEN=

# Routing (OSRM is free)
# Optional: Custom OSRM endpoint
NEXT_PUBLIC_OSRM_API=

# Real-time (Socket.io)
NEXT_PUBLIC_WS_URL=

# Notifications
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

---

## Database Schema (PostgreSQL + PostGIS)

### Core Tables
```sql
-- Incidents
CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  type VARCHAR(50),
  severity VARCHAR(20),
  status VARCHAR(20),
  location GEOMETRY(Point, 4326),
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Rescuers/Units
CREATE TABLE rescuers (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  role VARCHAR(50),
  unit_id VARCHAR(50),
  location GEOMETRY(Point, 4326),
  status VARCHAR(20),
  last_ping TIMESTAMP
);

-- Danger Zones
CREATE TABLE danger_zones (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  severity VARCHAR(20),
  area GEOMETRY(Polygon, 4326),
  type VARCHAR(50),
  created_at TIMESTAMP
);

-- Survivors
CREATE TABLE survivors (
  id UUID PRIMARY KEY,
  qr_code VARCHAR(100),
  status VARCHAR(50),
  found_at GEOMETRY(Point, 4326),
  rescuer_id UUID,
  created_at TIMESTAMP
);

-- Resources
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  type VARCHAR(50),
  label VARCHAR(100),
  location GEOMETRY(Point, 4326),
  fuel_pct NUMERIC(3,1),
  crew_count INT,
  battery_pct NUMERIC(3,1)
);
```

### PostGIS Queries
```sql
-- Find incidents within 5km
SELECT * FROM incidents 
WHERE ST_DWithin(location, ST_Point(-74.0060, 40.7128)::geography, 5000);

-- Check if route intersects danger zone
SELECT ST_Intersects(
  ST_LineFromText('LINESTRING(...)', 4326),
  area
) FROM danger_zones;

-- Heatmap: density of incidents
SELECT ST_ClusterKMeans(location, 10) 
FROM incidents 
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## Cron Jobs (Automation)

### Every 30 seconds
```typescript
// Ping all rescuer GPS locations
// Update map markers in real-time
// Publish to Redis pub/sub
```

### Every 3 minutes
```typescript
// Check unresponded SOS alerts
// Auto-escalate to next available unit
```

### Every 1 hour
```typescript
// Refresh danger zone data from external APIs
// Update flood/fire perimeter maps
```

### Daily
```typescript
// Run AI prediction model
// Generate risk overlay for next 24hr
```

### On Reconnect
```typescript
// Sync all IndexedDB queued events
// Upload offline reports to PostgreSQL
```

---

## Keyboard Shortcuts (Implemented)

| Key | Action |
|-----|--------|
| `S` | SOS panel (activate) |
| `R` | Routing (show routes) |
| `D` | Danger zones (toggle) |
| `E` | Resources (view equipment) |
| `I` | Incidents (toggle list) |
| `F` | Fullscreen map |
| `L` | Toggle layers |
| `Esc` | Clear selection |

---

## Development Roadmap

### Phase 1: Core (✅ Complete)
- [x] ResQMap config + constants
- [x] SOS Beacon hook
- [x] Offline map hook
- [x] Danger zones hook
- [x] Main dashboard UI
- [x] Incidents API
- [x] Danger zones API
- [x] Command center page

### Phase 2: Multi-Agency (This Week)
- [ ] Multi-agency dashboard
- [ ] Role-based visibility
- [ ] Incident commander panel
- [ ] Live chat per incident

### Phase 3: Advanced (Next Week)
- [ ] Survivor tracker + QR
- [ ] Drone feed overlay
- [ ] AI prediction model
- [ ] Resource inventory

### Phase 4: Polish & Scale
- [ ] Performance optimization
- [ ] Kubernetes deployment
- [ ] Load testing (10,000+ concurrent)
- [ ] Mobile app (React Native)
- [ ] SMS/PWA push notifications

---

## Deployment

### Local Development
```bash
# Clone repo
git clone ...
cd resqmap

# Install deps
npm install

# Setup .env
cp .env.example .env.local
# Edit with your credentials

# Run locally
npm run dev
# Visit http://localhost:3000/resqmap
```

### Docker Compose
```bash
docker-compose up -d
# PostgreSQL + Redis + Next.js
```

### Kubernetes (Production)
```bash
kubectl apply -f k8s/
# Auto-scaling, load balancing, rolling updates
```

### Vercel Deployment
```bash
# Connect GitHub repo
# Automatic deploys on push
# Environment variables set in Vercel dashboard
```

---

## Testing Strategy

### Unit Tests
```typescript
// useSOSBeacon.test.ts
test('SOS escalates after 3 minutes', async () => {
  const { activateBeacon, isEscalated } = renderHook(useSOSBeacon)
  activateBeacon()
  jest.advanceTimersByTime(180000)
  expect(isEscalated).toBe(true)
})

// pointInPolygon.test.ts
test('Point in polygon detection', () => {
  const point = [0, 0]
  const polygon = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  expect(pointInPolygon(point, polygon)).toBe(true)
})
```

### E2E Tests (Playwright)
```typescript
test('Can create incident and assign rescuer', async ({ page }) => {
  await page.goto('/resqmap')
  await page.click('button:has-text("Create Incident")')
  await page.fill('input[name="description"]', 'Car accident')
  await page.click('button:has-text("Submit")')
  await expect(page.locator('text=Car accident')).toBeVisible()
})
```

---

## Performance Optimization

### Frontend
- Code splitting with `dynamic()`
- Image lazy loading
- WebSocket batching (5s debounce)
- IndexedDB caching
- Service Worker precaching

### Backend
- PostgreSQL indexes on location, incident_id, created_at
- Redis caching (incidents, danger zones)
- API response streaming
- Gzip compression

### Infrastructure
- CDN for static assets
- Database connection pooling
- Horizontal scaling (Kubernetes)
- Load balancing

---

## Security

### Authentication
- JWT tokens from Supabase Auth
- Role-based access control
- Admin verification on dashboard access

### Data Protection
- Encrypted geolocation (TLS)
- Row-level security on Supabase
- Input validation with Zod
- Rate limiting on API endpoints

### Incident Commander
- Can lock/unlock areas
- Cannot delete resolved incidents (audit trail)
- Requires 2FA for high-risk actions

---

## Support & Documentation

- **Live Dashboard:** `/resqmap`
- **API Docs:** `/api/docs` (Swagger)
- **GitHub Issues:** For bug reports
- **Slack:** For team coordination
- **Email:** support@resqmap.local

---

## License
MIT - Open source for emergency response systems

---

**Status:** Ready for Phase 2 implementation
**Last Updated:** 2026-03-26
**Contributors:** ResQMap Team
