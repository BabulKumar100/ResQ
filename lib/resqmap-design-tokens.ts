/**
 * ResqMap Design Tokens
 * Dark mode Emergency Operations Center color palette and constants
 */

export const RESQMAP_COLORS = {
  // Primary dark backgrounds
  background: '#070d1a',
  surface: '#0f1428',
  surfaceLight: '#1a2141',
  
  // Severity colors (for incidents, alerts, markers)
  critical: '#ef4444', // Red - Critical/Danger
  high: '#f97316',     // Orange - High priority
  medium: '#eab308',   // Yellow - Medium priority
  low: '#22c55e',      // Green - Low/Safe
  
  // Status colors
  active: '#3b82f6',   // Blue - Active/Online
  inactive: '#6b7280', // Gray - Inactive/Offline
  pending: '#a78bfa',  // Purple - Pending
  resolved: '#10b981', // Teal - Resolved
  
  // UI elements
  border: '#1f2937',
  borderLight: '#374151',
  text: '#f3f4f6',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  
  // Accents
  accentBlue: '#0ea5e9',
  accentGreen: '#10b981',
  accentPurple: '#a855f7',
  accentRed: '#dc2626',
  
  // Overlays
  overlay: 'rgba(7, 13, 26, 0.8)',
  overlayLight: 'rgba(7, 13, 26, 0.95)',
}

export const RESQMAP_SEVERITY = {
  CRITICAL: { color: RESQMAP_COLORS.critical, label: 'Critical', priority: 4 },
  HIGH: { color: RESQMAP_COLORS.high, label: 'High', priority: 3 },
  MEDIUM: { color: RESQMAP_COLORS.medium, label: 'Medium', priority: 2 },
  LOW: { color: RESQMAP_COLORS.low, label: 'Low', priority: 1 },
}

export const RESQMAP_STATUS = {
  ACTIVE: { color: RESQMAP_COLORS.active, label: 'Active' },
  INACTIVE: { color: RESQMAP_COLORS.inactive, label: 'Inactive' },
  PENDING: { color: RESQMAP_COLORS.pending, label: 'Pending' },
  RESOLVED: { color: RESQMAP_COLORS.resolved, label: 'Resolved' },
}

// Typography
export const RESQMAP_TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

// Spacing - 4px base unit
export const RESQMAP_SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
}

// Layout dimensions
export const RESQMAP_LAYOUT = {
  topBarHeight: '48px',
  leftSidebarWidth: '240px',
  rightPanelCollapsed: '200px',
  rightPanelExpanded: '360px',
  liveTickerHeight: '28px',
  iconRailWidth: '48px',
}

// Border radius
export const RESQMAP_RADIUS = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
}

// Shadows
export const RESQMAP_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
}

// Z-index layers
export const RESQMAP_ZINDEX = {
  background: 0,
  map: 10,
  markers: 20,
  popups: 30,
  sidebar: 40,
  topbar: 50,
  modal: 100,
  tooltip: 110,
}
