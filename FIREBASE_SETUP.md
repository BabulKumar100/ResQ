## Firebase Migration Complete

This project has been migrated from Supabase to Firebase (free tier). All features are preserved and enhanced with real-time capabilities.

### 🚀 Quick Start

#### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project: "resqmap"
3. Enable these services:
   - **Firestore Database** (start in test mode for development)
   - **Realtime Database**
   - **Authentication** → Email/Password + Google
   - **Cloud Storage**

#### 2. Get Configuration

**For Frontend (.env):**
1. Go to Project Settings → Web App
2. Copy firebaseConfig values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**For Backend (.env):**
1. Go to Project Settings → Service Accounts
2. Generate new private key (JSON)
3. Extract these values:
```
FIREBASE_PROJECT_ID=your-project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

#### 3. Deploy Security Rules

**Firestore Security Rules:**
```bash
# Copy firestore.rules content to Firebase Console → Firestore → Rules
# Or use Firebase CLI:
firebase deploy --only firestore:rules
```

**Realtime Database Rules:**
```bash
# Copy database.rules.json to Firebase Console → Realtime Database → Rules
# Or use Firebase CLI:
firebase deploy --only database
```

#### 4. Install Dependencies
```bash
npm install
# or
pnpm install
```

#### 5. Start Development
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (optional for real-time features)
npm run dev:server
```

### 📁 New Files Structure

```
lib/
  ├── firebase.ts                  # Firebase client config
  ├── firebaseAuth.ts              # Auth utilities (login, register, etc.)
  ├── firestoreService.ts          # CRUD operations for all collections
  ├── useRealtime.ts               # React hooks for real-time data

server/
  ├── lib/
  │   ├── firebaseAdmin.ts         # Firebase Admin SDK config
  │   └── firebaseService.ts       # Server-side operations
  ├── middleware/
  │   └── auth.ts                  # Firebase token verification

firestore.rules                    # Firestore security rules
database.rules.json                # Realtime Database security rules
.env.example                       # Updated for Firebase
```

### 🗄️ Database Collections

**Firestore Collections:**
- `incidents/{id}` - Disaster events and emergencies
- `rescuers/{id}` - Rescue personnel profiles
- `sos_beacons/{id}` - Emergency SOS alerts
- `danger_zones/{id}` - Active hazard areas
- `survivors/{id}` - Missing/rescued people tracking
- `resources/{id}` - Equipment and supplies
- `live_events/{id}` - External feed data (GDACS, USGS, etc.)
- `incident_chat/{incidentId}/messages/{id}` - Team coordination chat
- `alerts_broadcast/{id}` - Public safety alerts

**Realtime Database:**
- `rescuer_positions/{rescuerId}` - Live GPS locations (faster than Firestore)

### 🔐 Security Features

- **Role-Based Access Control**: admin, dispatcher, rescuer, viewer
- **Field-Level Encryption**: Available via Cloud Functions
- **Offline Support**: Firestore persistence enabled
- **Real-time Listeners**: Automatic updates via onSnapshot/onValue

### 🔄 Real-Time Hooks (React)

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

### 💾 CRUD Operations

```tsx
import {
  createIncident,
  updateIncident,
  triggerSOS,
  getNearestRescuers,
} from '@/lib/firestoreService';

// Create incident
const incidentId = await createIncident({
  type: 'flood',
  severity: 'high',
  lat: 40.7128,
  lng: -74.0060,
  // ... other fields
});

// Get nearest available rescuers
const rescuers = await getNearestRescuers(40.7128, -74.0060, 5);

// Send SOS
const sosId = await triggerSOS({
  senderId: currentUser.uid,
  lat: userLat,
  lng: userLng,
  message: 'Need help!',
  status: 'pending',
  escalationCount: 0,
});
```

### 🌐 API Integration

Backend APIs use Firebase token verification:

```tsx
// Frontend
const idToken = await auth.currentUser?.getIdToken();
const response = await fetch('/api/incidents', {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});

// Backend
import { firebaseAuthMiddleware } from '@/server/middleware/auth';
app.post('/api/incidents', firebaseAuthMiddleware, async (req, res) => {
  // req.user contains decoded Firebase token
  // req.userRole contains user's role
});
```

### 📊 External Data Feeds (Free APIs)

The system integrates with these free feeds:
- **GDACS** - Global disaster alerts
- **USGS** - Earthquake data
- **NASA FIRMS** - Fire detections
- **NOAA** - Weather alerts
- **WHO** - Disease outbreaks
- **OpenWeatherMap** (free tier)

### 📞 Firebase Free Tier Limits

- **Firestore**: 50k reads/day, 20k writes/day, 1 GB storage
- **Realtime DB**: 100 concurrent connections, 1 GB storage
- **Auth**: 10k users/month
- **Storage**: 5 GB free
- **Cloud Functions**: 125k invocations/month

*Perfect for development and small deployments!*

### 🔧 Deployment

**To Firebase Hosting:**
```bash
firebase deploy
```

**To Vercel:**
```bash
vercel deploy
```

### ❓ FAQ

**Q: Can I use this in production?**
A: Yes! Firebase free tier is suitable for small production deployments. Upgrade to Blaze plan for unlimited scaling.

**Q: How do I backup my data?**
A: Firebase Firestore auto-backs up all data daily. Use Firestore Import/Export for manual backups.

**Q: Can I migrate back to Supabase?**
A: Yes, but you'd need to rewrite database layers. The CRUD service interface remains compatible.

**Q: Are there offline-first features?**
A: Yes! Firestore persistence is enabled. Data syncs automatically when connection returns.

---

**Questions?** Check Firebase docs: https://firebase.google.com/docs
