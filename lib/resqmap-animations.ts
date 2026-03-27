/**
 * Framer Motion animation presets for ResqMap
 * Reusable animation definitions for consistency
 */

export const RESQMAP_ANIMATIONS = {
  // Container animations
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Slide in from left (for sidebar items)
  slideInFromLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },

  // Slide in from right (for right panel)
  slideInFromRight: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },

  // Slide in from top (for alerts, modals)
  slideInFromTop: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  },

  // Fade in animation
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  },

  // Scale up (for new items)
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  },

  // Pulse animation (for critical alerts)
  pulse: {
    animate: {
      opacity: [1, 0.6, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Number animation (for stat counters)
  numberChange: {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },

  // Bounce animation (for attention)
  bounce: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  },

  // Rotate (for loading spinners)
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  // Breathe (subtle pulse for idle state)
  breathe: {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Glow animation (for active markers)
  glow: {
    animate: {
      boxShadow: [
        '0 0 4px rgba(59, 130, 246, 0.3)',
        '0 0 12px rgba(59, 130, 246, 0.6)',
        '0 0 4px rgba(59, 130, 246, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Map marker bounce (entry animation)
  markerBounce: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
      },
    },
  },

  // Tooltip appear
  tooltipAppear: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: 8,
      transition: { duration: 0.2 },
    },
  },
}

// Easing functions
export const RESQMAP_EASING = {
  ease: 'easeInOut',
  easeOut: 'easeOut',
  easeIn: 'easeIn',
  sharp: 'cubic-bezier(0.4, 0, 1, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}

// Transition durations (in seconds)
export const RESQMAP_DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
}
