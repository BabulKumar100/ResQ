// Example Usage Guide for Firebase Integration

// ============================================================
// 1. AUTHENTICATION
// ============================================================

import { loginWithGoogle, registerWithEmail, logout, getCurrentAuthUser } from '@/lib/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Login with email
async function handleLogin() {
  try {
    const user = await loginWithGoogle();
    console.log('Logged in:', user.email);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Register new account
async function handleRegister() {
  try {
    const user = await registerWithEmail(email, password, name);
    console.log('Account created:', user.email);
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Listen to auth state changes
function useAuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser = await getCurrentAuthUser(firebaseUser);
        console.log('User role:', authUser?.role);
      } else {
        console.log('Not logged in');
      }
    });
    return unsubscribe;
  }, []);
}

// ============================================================
// 2. REAL-TIME DATA HOOKS
// ============================================================

import {
  useRealtimeIncidents,
  useRealtimeSOS,
  useRealtimeDangerZones,
  useRealtimeRescuers,
  useRealtimeRescuerPositions,
  useRealtimeLiveEvents,
} from '@/lib/useRealtime';

function IncidentDashboard() {
  const { incidents, loading } = useRealtimeIncidents();
  const { sosAlerts } = useRealtimeSOS();
  const { zones } = useRealtimeDangerZones();
  const positions = useRealtimeRescuerPositions();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Active Incidents: {incidents.length}</h2>
      {incidents.map((incident) => (
        <div key={incident.id}>
          <h3>{incident.type}</h3>
          <p>Severity: {incident.severity}</p>
          <p>Location: {incident.lat}, {incident.lng}</p>
        </div>
      ))}

      <h2>SOS Alerts: {sosAlerts.length}</h2>
      {sosAlerts.map((sos) => (
        <div key={sos.id}>
          <p>{sos.message}</p>
          <p>Status: {sos.status}</p>
        </div>
      ))}

      <h2>Rescuer Positions</h2>
      {Object.entries(positions).map(([rescuerId, pos]: any) => (
        <div key={rescuerId}>
          <p>
            {rescuerId}: ({pos.lat}, {pos.lng})
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 3. CRUD OPERATIONS
// ============================================================

import {
  createIncident,
  updateIncident,
  resolveIncident,
  getActiveIncidents,
  getNearestRescuers,
  triggerSOS,
  upsertSurvivor,
  createDangerZone,
  sendChatMessage,
} from '@/lib/firestoreService';

// Create a new incident
async function reportIncident(incidentData: any) {
  try {
    const incidentId = await createIncident({
      type: 'flood',
      severity: 'high',
      lat: 40.7128,
      lng: -74.006,
      address: '123 Main St, NYC',
      status: 'active',
      agency: 'FDNY',
      source: 'manual',
      description: 'Flash flooding in downtown area',
      assignedTo: [],
      reportedBy: 'user123',
    });
    console.log('Incident created:', incidentId);
  } catch (error) {
    console.error('Failed to create incident:', error);
  }
}

// Update incident status
async function assignIncident(incidentId: string, rescuerId: string) {
  try {
    await updateIncident(incidentId, {
      status: 'assigned',
      assignedTo: [rescuerId],
    });
    console.log('Incident assigned');
  } catch (error) {
    console.error('Failed to assign incident:', error);
  }
}

// Resolve incident
async function completeIncident(incidentId: string) {
  try {
    await resolveIncident(incidentId);
    console.log('Incident resolved');
  } catch (error) {
    console.error('Failed to resolve incident:', error);
  }
}

// Find nearest rescuers
async function findAvailableRescuers(lat: number, lng: number) {
  try {
    const rescuers = await getNearestRescuers(lat, lng, 5); // 5km radius
    console.log('Nearby rescuers:', rescuers);
    return rescuers;
  } catch (error) {
    console.error('Failed to find rescuers:', error);
  }
}

// Send SOS signal
async function sendSOS(userId: string, lat: number, lng: number, message: string) {
  try {
    const sosId = await triggerSOS({
      senderId: userId,
      lat,
      lng,
      message,
      status: 'pending',
      escalationCount: 0,
    });
    console.log('SOS sent:', sosId);
    // Socket.io will broadcast this event
    socket.emit('sos:new', { sosId });
  } catch (error) {
    console.error('Failed to send SOS:', error);
  }
}

// Register survivor
async function registerSurvivor(qrCode: string, name: string, age: number, lat: number, lng: number) {
  try {
    const survivorId = await upsertSurvivor(qrCode, {
      name,
      age,
      status: 'found',
      lat,
      lng,
    });
    console.log('Survivor registered:', survivorId);
  } catch (error) {
    console.error('Failed to register survivor:', error);
  }
}

// Create danger zone
async function markDangerZone(coordinates: any[], type: string) {
  try {
    const zoneId = await createDangerZone({
      name: 'Active Fire Zone',
      severity: 'critical',
      type: type as 'flood' | 'fire' | 'collapse' | 'chemical' | 'biological',
      source: 'nasa',
      coordinates,
      active: true,
    });
    console.log('Danger zone created:', zoneId);
  } catch (error) {
    console.error('Failed to create danger zone:', error);
  }
}

// ============================================================
// 4. CHAT & COMMUNICATION
// ============================================================

import { useRealtimeChat } from '@/lib/useRealtime';

function IncidentChat({ incidentId }: { incidentId: string }) {
  const { messages, loading } = useRealtimeChat(incidentId);
  const [text, setText] = useState('');
  const currentUser = auth.currentUser;

  const handleSendMessage = async () => {
    if (!currentUser || !text.trim()) return;

    try {
      const messageId = await sendChatMessage(
        incidentId,
        currentUser.uid,
        currentUser.displayName || 'Anonymous',
        text
      );
      setText('');
      console.log('Message sent:', messageId);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.userName}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type message..." />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

// ============================================================
// 5. API INTEGRATION WITH AUTH
// ============================================================

// On frontend, get token and send with request
async function makeAuthenticatedRequest(endpoint: string) {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
  }
}

// On backend, verify token
import { firebaseAuthMiddleware } from '@/server/middleware/auth';

app.get('/api/incidents', firebaseAuthMiddleware, async (req: AuthRequest, res) => {
  // req.user = decoded Firebase token
  // req.userRole = 'admin' | 'dispatcher' | 'rescuer' | 'viewer'

  const userRole = req.userRole;
  if (userRole === 'viewer') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  // Fetch data...
  res.json(data);
});

// ============================================================
// 6. SOCKET.IO INTEGRATION
// ============================================================

import io from 'socket.io-client';

// Connect with Firebase token
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: {
    token: await auth.currentUser?.getIdToken(),
  },
});

// Listen to real-time events
socket.on('incident:create', (incident) => {
  console.log('New incident:', incident);
  // Update UI
});

socket.on('sos:trigger', (sos) => {
  console.log('SOS received:', sos);
  // Show alert
});

socket.on('sos:escalate', (data) => {
  console.log('SOS escalated:', data);
});

socket.on('rescuer:position', (position) => {
  console.log('Rescuer position update:', position);
});

// ============================================================
// 7. COMPLETE EXAMPLE: INCIDENT RESPONSE FLOW
// ============================================================

async function handleIncidentResponse(incidentId: string, userId: string) {
  try {
    // 1. Get incident details
    const incident = await getIncidentDoc(incidentId);
    console.log('Incident:', incident);

    // 2. Find nearby rescuers
    const rescuers = await getNearestRescuers(incident.lat, incident.lng, 5);
    console.log('Available rescuers:', rescuers);

    // 3. Assign first available rescuer
    if (rescuers.length > 0) {
      await updateIncident(incidentId, {
        status: 'assigned',
        assignedTo: [rescuers[0].id],
      });
      console.log('Incident assigned to:', rescuers[0].name);

      // 4. Send notification via Socket.io
      socket.emit('incident:assigned', {
        incidentId,
        rescuerId: rescuers[0].id,
        rescuerName: rescuers[0].name,
      });

      // 5. Open incident chat
      // Navigate to chat component with incidentId
    }
  } catch (error) {
    console.error('Incident response failed:', error);
  }
}

export default {
  handleIncidentResponse,
  findAvailableRescuers,
  sendSOS,
  registerSurvivor,
  markDangerZone,
};
