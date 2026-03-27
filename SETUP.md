# ResQMap - Emergency Response & Resource Navigation Platform

ResQMap is a comprehensive real-time emergency response and disaster management platform that connects people in crisis with emergency services, resources, and safe zones.

## Features

- **Emergency Services Map** - Find nearby hospitals, police, fire stations with real-time routing
- **Accessible Routes** - Navigate barrier-free paths with wheelchair accessibility information
- **Local Resources** - Discover pharmacies, shelters, food banks, and community services
- **Disaster Dashboard** - Real-time disaster tracking and safe zone information
- **SOS Emergency System** - One-tap emergency alerts to contacts and responders
- **Real-time Updates** - Socket.io integration for live incident tracking and notifications

## Tech Stack

- **Frontend**: Next.js 16 + React 19 with TypeScript
- **Backend**: Express.js + Socket.io for real-time communication
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet + React Leaflet
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.io client/server

## Project Structure

```
.
├── app/                          # Next.js app routes
│   ├── page.tsx                 # Homepage
│   ├── dashboard/               # Dashboard page
│   ├── resources/               # Resources page
│   ├── disasters/               # Disasters page
│   ├── sos/                     # SOS emergency page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── Navigation.tsx           # Main navigation
│   ├── ResQMap.tsx              # Interactive map
│   ├── ContactManager.tsx       # Emergency contacts management
│   ├── DisasterList.tsx         # Disaster list display
│   └── SOSHandler.tsx           # SOS alert handler
├── lib/
│   ├── store.ts                 # Zustand state management store
│   └── supabase.ts              # Supabase client
├── server/
│   └── index.js                 # Express + Socket.io backend
├── scripts/                      # Database migration scripts
│   ├── 01-create-schema.sql     # Schema creation
│   └── 02-seed-data.sql         # Mock data
└── package.json                  # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (optional for database)

### Installation

1. **Clone the repository**
```bash
git clone <repo>
cd Disaster-Resque
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start the development servers**

In one terminal, run the frontend:
```bash
npm run dev
```

In another terminal, run the backend server:
```bash
npm run dev:server
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Usage

### Dashboard
- View real-time statistics on active incidents and SOS alerts
- Monitor all active emergency incidents
- Track affected areas and severity levels
- See online rescuers and survivor count

### Resources Page
- Search for local resources (hospitals, pharmacies, shelters)
- Filter by resource type
- View distance and availability information
- Get directions to resources

### Disasters Page
- Real-time disaster tracking
- View incident severity and affected areas
- See recommended safe zones
- View critical incidents prioritized by severity

### SOS Emergency
- Send emergency alerts with location
- Specify emergency type and severity
- Add emergency contacts
- View nearby active alerts
- Real-time alert tracking

## Real-time Architecture

### Socket.io Events

**Client → Server:**
- `user:register` - Register user with location and type
- `incident:create` - Report a new incident
- `incident:update` - Update incident details
- `sos:alert` - Send SOS emergency alert
- `rescuer:location` - Update rescuer location
- `survivor:location` - Update survivor location
- `help:request` - Request help
- `danger:zone:create` - Create danger zone alert

**Server → Client:**
- `users:updated` - Broadcast active users list
- `incident:created` - New incident reported
- `incident:updated` - Incident details updated
- `sos:received` - SOS alert received
- `danger:zone:created` - New danger zone
- `rescuer:location` - Rescuer location update
- `survivor:location` - Survivor location update
- `help:requested` - Help request received

## Database Schema

### Tables
- **users** - User profiles and authentication
- **incidents** - Disaster incidents and emergency reports
- **rescuers** - Rescuer profiles and availability
- **sos_beacons** - Emergency SOS alerts
- **danger_zones** - Dangerous areas during disasters
- **survivors** - Survivor tracking and status
- **resources** - Local resources (hospitals, shelters, etc.)
- **safe_zones** - Designated safe areas
- **live_events** - Real-time event streaming

## State Management

The app uses Zustand for state management with Socket.io integration:

```typescript
const { 
  socket,           // Socket.io connection
  isConnected,      // Connection status
  incidents,        // Active incidents
  sosAlerts,        // SOS alerts
  activeUsers,      // Connected users
  connect,          // Initialize connection
  sendSOS,          // Send SOS alert
  reportIncident    // Report new incident
} = useDisasterStore();
```

## Development

### Adding a New Feature

1. Create components in `/components`
2. Add pages in `/app`
3. Integrate with Zustand store in `/lib/store.ts`
4. Add Socket.io events to backend `/server/index.js`
5. Test with both frontend and backend running

### Database Migrations

1. Create SQL file in `/scripts`
2. Execute using `SystemAction` in v0
3. Reference in code through Supabase client

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Self-hosted or Cloud)
```bash
NODE_ENV=production npm run dev:server
```

## Safety Features

- Real-time location sharing with emergency services
- Emergency contact notification system
- Automatic incident escalation based on severity
- Safe zone identification and guidance
- Resource availability tracking
- User type-based access control

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT

## Support

For issues or questions, create an issue in the repository or contact the development team.

## Founder

**Pawan Singh** - Full-stack developer and ResQMap creator

- Email: pawan9140582015@gmail.com
- LinkedIn: [Pawan Singh](https://www.linkedin.com/in/pawan-singh-555423322/)

---

**ResQMap** - Connecting people in crisis with help, resources, and safety. Built with ❤️ for emergency response.
