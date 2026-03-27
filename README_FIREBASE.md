# 🚨 ResqMap - Firebase Edition

**Disaster Response Platform with Real-Time Coordination**

> Firebase-powered replacement for Supabase with all features intact + enhanced capabilities

## 🎯 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up Firebase (see FIREBASE_SETUP.md)
# 3. Add environment variables to .env
# 4. Start development
npm run dev
```

## 📂 What's Included

### Core Features (Ready to Use ✅)
- **Real-time Incident Tracking** - Live disaster map with automatic updates
- **SOS Beacon System** - Emergency distress signals with escalation
- **Rescuer Coordination** - GPS tracking, team chat, resource allocation
- **Survivor Management** - QR code tracking for missing persons
- **Danger Zone Mapping** - Active hazard area visualization
- **External Data Feeds** - GDACS, USGS, NASA FIRMS integration
- **Role-Based Access** - Admin, dispatcher, rescuer, viewer permissions

### Technology Stack
```
Frontend:  React 19 + Next.js 16 + TypeScript + Tailwind CSS
Database:  Firebase (Firestore + Realtime DB)
Auth:      Firebase Auth (Email + Google)
Backend:   Node.js + Express + Socket.io
Maps:      Leaflet + React-Leaflet
Geo:       Turf.js + GeoFirestore
```

## 📁 Project Structure

```
lib/
├── firebase.ts              ← Firebase client config
├── firebaseAuth.ts          ← Login, register, auth
├── firestoreService.ts      ← CRUD for all data
└── useRealtime.ts           ← Real-time React hooks

server/
├── lib/
│   ├── firebaseAdmin.ts     ← Firebase Admin config
│   └── firebaseService.ts   ← Server-side operations
└── middleware/
    └── auth.ts              ← Token verification

firestore.rules             ← Security rules
database.rules.json         ← Realtime DB rules
```

## 🔥 10-Minute Usage Guide

### 1. Authentication
```tsx
import { loginWithGoogle, registerWithEmail } from '@/lib/firebaseAuth';

// Sign in with Google
await loginWithGoogle();

// Or register with email
await registerWithEmail(email, password, name);
```

### 2. Real-Time Data
```tsx
import { useRealtimeIncidents, useRealtimeSOS } from '@/lib/useRealtime';

function Dashboard() {
  const { incidents, loading } = useRealtimeIncidents();
  const { sosAlerts } = useRealtimeSOS();
  
  return (
    <div>
      {incidents.map(incident => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
}
```

### 3. Create Incident
```tsx
import { createIncident, getNearestRescuers } from '@/lib/firestoreService';

// Report incident
const incidentId = await createIncident({
  type: 'flood',
  severity: 'high',
  lat: 40.7128,
  lng: -74.006,
  description: 'Flash flooding downtown',
  // ... more fields
});

// Auto-assign nearest rescuer
const rescuers = await getNearestRescuers(40.7128, -74.006, 5); // 5km radius
```

### 4. Send SOS
```tsx
import { triggerSOS } from '@/lib/firestoreService';

await triggerSOS({
  senderId: currentUser.uid,
  lat: userLocation.lat,
  lng: userLocation.lng,
  message: 'Need emergency assistance!',
  status: 'pending',
  escalationCount: 0,
});
```

### 5. Team Chat
```tsx
import { useRealtimeChat } from '@/lib/useRealtime';
import { sendChatMessage } from '@/lib/firestoreService';

function IncidentChat({ incidentId }) {
  const { messages } = useRealtimeChat(incidentId);
  
  const send = () => {
    sendChatMessage(incidentId, userId, userName, message);
  };
}
```

## 🛡️ Security

**Role-Based Access Control:**
- **Admin**: Full system access
- **Dispatcher**: Create/manage incidents, assign resources
- **Rescuer**: Update position, report status, chat
- **Viewer**: Read-only access to public data

**Security Rules Applied:**
- Firestore: Collection & document-level access control
- Realtime DB: Position data protected by owner
- API: Token verification on all routes
- Socket.io: Authenticated connections only

## 📊 Database Collections

| Collection | Purpose | Examples |
|------------|---------|----------|
| `incidents` | Disaster events | floods, earthquakes, fires |
| `rescuers` | Team members | firefighters, paramedics |
| `sos_beacons` | Emergency calls | panic buttons, distress signals |
| `danger_zones` | Hazard areas | active fire zones, flood areas |
| `survivors` | Tracking | missing persons, rescued people |
| `resources` | Equipment | ambulances, fire trucks, supplies |
| `live_events` | External feeds | GDACS, USGS, NASA data |
| `incident_chat` | Team messages | coordination, updates, notes |
| `alerts_broadcast` | Public alerts | emergency notifications |

## 🔄 Real-Time Hooks (React)

```tsx
// All of these update automatically:
useRealtimeIncidents()           // Active incidents
useRealtimeSOS()                 // Emergency alerts
useRealtimeDangerZones()         // Hazard zones
useRealtimeRescuers()            // Team availability
useRealtimeRescuerPositions()    // Live GPS tracking
useRealtimeLiveEvents()          // External feeds
useRealtimeSurvivors()           // Missing persons
useRealtimeChat(incidentId)      // Team messages
```

## 💰 Free Tier Limits

| Feature | Limit | Plenty for... |
|---------|-------|---|
| Firestore Reads | 50k/day | Development + small deployments |
| Firestore Writes | 20k/day | Incident tracking at scale |
| Storage | 1 GB | Images, QR codes, documents |
| Auth Users | 10k/month | Regional emergency teams |
| Concurrent Users | Unlimited | As many as you need |

**Scales automatically** - Upgrade to Blaze plan for unlimited usage

## 🚀 Deployment

### Local Development
```bash
npm run dev           # Frontend on :3000
npm run dev:server    # Backend on :3001
```

### To Vercel
```bash
vercel deploy
# Automatically uses Firebase from .env
```

### To Firebase Hosting
```bash
firebase deploy
# Deploys app + security rules + functions
```

## 📚 Documentation

| File | What It's For |
|------|---|
| `FIREBASE_SETUP.md` | Step-by-step setup instructions |
| `FIREBASE_COMPLETE.md` | Full feature overview |
| `FIREBASE_EXAMPLES.md` | Copy-paste code examples |
| `MIGRATION_SUMMARY.md` | What changed from Supabase |

## ✅ All Features Preserved

From the original Supabase implementation:
- ✅ User authentication
- ✅ Real-time incident tracking
- ✅ SOS beacon system
- ✅ Rescuer positioning
- ✅ Survivor management
- ✅ Danger zone mapping
- ✅ External data feeds
- ✅ Team chat
- ✅ Role-based access
- ✅ Mobile responsive UI

## 🎯 Next Steps

1. **Read** `FIREBASE_SETUP.md` for detailed setup
2. **Create** Firebase project (free at console.firebase.google.com)
3. **Configure** environment variables
4. **Install** dependencies: `npm install`
5. **Test** locally: `npm run dev`
6. **Deploy** security rules
7. **Launch** to production

## 🆘 Troubleshooting

**Firebase config not loading?**
- Check `.env` has all FIREBASE variables
- Verify project ID matches Firebase console

**Real-time updates not working?**
- Check Firestore rules are deployed
- Verify user has read permission for collection

**Auth failing?**
- Make sure Auth is enabled in Firebase console
- Check email/Google provider is configured

**Server can't connect?**
- Verify FIREBASE_PRIVATE_KEY is correct
- Check service account has Firestore access

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Reference**: https://firebase.google.com/docs/firestore
- **Security Rules**: https://firebase.google.com/docs/rules
- **Authentication**: https://firebase.google.com/docs/auth

---

**Built with Firebase 🔥 | Ready for Production ✅ | Free to Scale 💚**

Happy disaster response! 🚨
