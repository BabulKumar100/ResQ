import axios from 'axios'
import * as turf from '@turf/turf'
import { LatLngExpression } from 'leaflet'

export interface RouteOption {
  type: 'safe' | 'caution' | 'blocked'
  distance: number
  duration: number
  coordinates: [number, number][]
  warning?: string
}

export const calculateSafeRoute = async (
  start: [number, number],
  end: [number, number],
  dangerZones: any[]
): Promise<RouteOption[]> => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`
    const { data } = await axios.get(url)
    
    if (!data.routes || data.routes.length === 0) return []

    const route = data.routes[0]
    const routeCoords = route.geometry.coordinates.map((c: any) => [c[1], c[0]])
    const routeLine = turf.lineString(route.geometry.coordinates)

    let status: 'safe' | 'caution' | 'blocked' = 'safe'
    let warning = ''

    for (const zone of dangerZones) {
      if (!zone.lat || !zone.lng || !zone.radius) continue
      
      const zoneCenter = [zone.lng, zone.lat]
      const zoneBuffer = turf.circle(zoneCenter, zone.radius / 1000, { units: 'kilometers' })
      
      if (turf.booleanIntersects(routeLine, zoneBuffer)) {
        status = 'blocked'
        warning = `Route passes through ${zone.type || 'Danger Zone'}`
        break
      }

      // Check for 'caution' (within 2km of zone)
      const cautionBuffer = turf.circle(zoneCenter, (zone.radius + 2000) / 1000, { units: 'kilometers' })
      if (turf.booleanIntersects(routeLine, cautionBuffer)) {
        status = 'caution'
        warning = `Route passes near ${zone.type || 'Danger Zone'}`
      }
    }

    return [{
      type: status,
      distance: route.distance,
      duration: route.duration,
      coordinates: routeCoords,
      warning
    }]
  } catch (error) {
    console.error('Routing error:', error)
    return []
  }
}
