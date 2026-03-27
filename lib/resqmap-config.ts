// ResQMap Configuration Constants
export const RESQMAP_CONFIG = {
  // Branding
  APP_NAME: 'ResQMap',
  APP_DESCRIPTION: 'Real-time Emergency Rescue Coordination Platform',
  LOGO_URL: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RESQMAPKO-eZTYR9rGICNQYmYDMiprTziSIHPNWv.jpeg',
  
  // Colors (Dark mode first)
  COLORS: {
    CRITICAL: '#ef4444', // red-500
    WARNING: '#f59e0b', // amber-500
    SAFE: '#22c55e', // green-500
    INFO: '#3b82f6', // blue-500
    OFFLINE: '#6b7280', // gray-500
  },
  
  // Map Configuration
  MAP: {
    DEFAULT_CENTER: [40.7128, -74.0060], // NYC
    DEFAULT_ZOOM: 13,
    OSM_TILES: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    MIN_ZOOM: 8,
    MAX_ZOOM: 18,
    TILE_CACHE_SIZE: 3, // regions
  },
  
  // SOS Configuration
  SOS: {
    ESCALATION_TIMEOUT: 180000, // 3 min in ms
    PULSE_RADIUS_MIN: 500, // meters
    PULSE_RADIUS_MAX: 2000,
    ANIMATION_DURATION: 2000,
    BROADCAST_INTERVAL: 5000, // WebSocket ping
  },
  
  // Routing (OSRM)
  ROUTING: {
    OSRM_API: 'https://router.project-osrm.org/route/v1/driving',
    REROUTE_INTERVAL: 30000, // 30 sec
  },
  
  // Danger Zones
  DANGER_ZONES: {
    SEVERITY_LEVELS: {
      CRITICAL: 'red',
      MODERATE: 'orange',
      CAUTION: 'yellow',
    },
    REFRESH_INTERVAL: 60000, // 1 min
  },
  
  // Automation
  CRON_INTERVALS: {
    GPS_UPDATE: 30000, // 30 sec
    SOS_ESCALATION: 180000, // 3 min
    DANGER_ZONE_REFRESH: 3600000, // 1 hr
    ML_PREDICTION: 86400000, // 1 day
  },

  // Incident Types
  INCIDENT_TYPES: [
    'medical-emergency',
    'traffic-accident',
    'fire',
    'flood',
    'collapse',
    'hazmat',
    'missing-person',
    'other'
  ],

  // Rescuer Roles
  ROLES: {
    ADMIN: 'admin',
    INCIDENT_COMMANDER: 'incident-commander',
    DISPATCHER: 'dispatcher',
    RESCUER: 'rescuer',
    VIEWER: 'viewer',
  },

  // Survivor Status
  SURVIVOR_STATUS: [
    'found',
    'injured',
    'rescued',
    'hospitalized',
    'deceased'
  ]
} as const

export type ResQMapConfig = typeof RESQMAP_CONFIG
