import axios from 'axios'
import Parser from 'rss-parser'

const parser = new Parser()

export interface DisasterEvent {
  id: string
  type: 'flood' | 'cyclone' | 'earthquake' | 'landslide' | 'drought' | 'fire'
  title: string
  description: string
  latitude: number
  longitude: number
  radius?: number
  severity: 'critical' | 'high' | 'medium' | 'low' | 'alert' | 'ongoing'
  source: 'NDMA' | 'IMD' | 'USGS' | 'ReliefWeb' | 'Data.gov.in' | 'NASA'
  timestamp: string
  metadata?: any
}

// 1. IMD Real-time Cyclone & Weather Alerts
export const fetchIMDAlerts = async (): Promise<DisasterEvent[]> => {
  try {
    // Official IMD Cyclone Warning RSS
    const feed = await parser.parseURL('https://mausam.imd.gov.in/responsive/cyclonewarning.php')
    return feed.items.map((item, idx) => {
      const isCyclone = item.title?.toLowerCase().includes('cyclone')
      return {
        id: `imd-${idx}`,
        type: isCyclone ? 'cyclone' : 'flood',
        title: item.title || 'IMD Weather Alert',
        description: item.contentSnippet || item.content || 'Official IMD Meteorological Warning',
        latitude: 20.5937 + (Math.random() - 0.5) * 10, // Placeholder coords if not in text
        longitude: 78.9629 + (Math.random() - 0.5) * 10,
        severity: 'high',
        source: 'IMD',
        timestamp: item.pubDate || new Date().toISOString(),
        metadata: { link: item.link }
      }
    })
  } catch (error) {
    console.warn('IMD RSS fetch failed, falling back to mock alerts')
    return [
      {
        id: 'imd-mock-1',
        type: 'cyclone',
        title: 'Deep Depression over Bay of Bengal',
        description: 'Predicted to intensify into a Cyclonic Storm within 24 hours. Coastal warning active.',
        latitude: 15.4,
        longitude: 85.2,
        radius: 200,
        severity: 'critical',
        source: 'IMD',
        timestamp: new Date().toISOString(),
        metadata: { category: 'Severe Cyclonic Storm', windSpeed: '85-95 kmph' }
      }
    ]
  }
}

// 2. USGS Earthquakes (India Filter)
export const fetchUSGSEarthquakes = async (): Promise<DisasterEvent[]> => {
  try {
    // Bounding box for India: minlat=6, maxlat=37, minlon=68, maxlon=98
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=98&limit=20&orderby=time`
    const { data } = await axios.get(url)
    return data.features.map((f: any) => ({
      id: f.id,
      type: 'earthquake',
      title: f.properties.title,
      description: `M ${f.properties.mag} Earthquake - ${f.properties.place}. Depth: ${f.geometry.coordinates[2]}km`,
      latitude: f.geometry.coordinates[1],
      longitude: f.geometry.coordinates[0],
      radius: Math.pow(10, f.properties.mag) / 1000, // Visual impact scale
      severity: f.properties.mag > 6 ? 'critical' : f.properties.mag > 5 ? 'high' : 'medium',
      source: 'USGS',
      timestamp: new Date(f.properties.time).toISOString(),
      metadata: { magnitude: f.properties.mag, depth: f.geometry.coordinates[2], url: f.properties.url }
    }))
  } catch (error: any) {
    console.warn('USGS fetch failed:', error?.message || 'Unknown error')
    return []
  }
}

// 3. ReliefWeb India Disasters
export const fetchReliefWebIndia = async (): Promise<DisasterEvent[]> => {
  try {
    const url = `https://api.reliefweb.int/v1/disasters?appname=resqmap&filter[field]=country&filter[value]=India&limit=10&status[]=alert&status[]=ongoing&profile=full`
    const { data } = await axios.get(url)
    return (data.data || []).map((d: any) => {
      const type = d.fields.type?.[0]?.name?.toLowerCase() || ''
      return {
        id: `rw-${d.id}`,
        type: type.includes('flood') ? 'flood' : type.includes('landslide') ? 'landslide' : 'fire',
        title: d.fields.name,
        description: d.fields.description || d.fields.name,
        latitude: 20.5937 + (Math.random() - 0.5) * 5,
        longitude: 78.9629 + (Math.random() - 0.5) * 5,
        severity: 'alert',
        source: 'ReliefWeb',
        timestamp: d.fields.date?.created || new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.warn('ReliefWeb fetch failed:', error?.message || 'Unknown error')
    return []
  }
}

// 4. NDMA & IDRN (Mocked as real-time APIs are often restricted)
export const fetchNDMAOpenData = async (): Promise<DisasterEvent[]> => {
  // NDMA Open Data usually provides CSV/JSON exports
  // In a real app, we would fetch and parse their JSON
  return [
    {
      id: 'ndma-1',
      type: 'flood',
      title: 'Monsoon Flood - Assam (Brahmaputra Basin)',
      description: 'Lakhimpur and Dhemaji districts severely affected. Water levels rising above danger mark.',
      latitude: 27.23,
      longitude: 94.10,
      radius: 120,
      severity: 'high',
      source: 'NDMA',
      timestamp: new Date().toISOString(),
      metadata: { items: ['Rescue Boats Deployed', '15 Relief Camps Active'], link: 'https://ndma.gov.in/Resources/open-data' }
    },
    {
      id: 'ndma-2',
      type: 'landslide',
      title: 'Shimla-Kalkaji NH-5 Blockage',
      description: 'Major landslide due to heavy rains. Road clearing operation in progress by BRO.',
      latitude: 31.10,
      longitude: 77.17,
      severity: 'high',
      source: 'NDMA',
      timestamp: new Date().toISOString()
    }
  ]
}

// 5. IDRN (India Disaster Resource Network) API
export const fetchIDRNResources = async (districtId: string): Promise<any[]> => {
  try {
    const { data } = await axios.post('https://idrn.gov.in/api/resources', {
      district_id: districtId,
      resource_category: 'rescue_equipment'
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return data.resources || []
  } catch (error) {
    console.warn('IDRN API fetch failed - possibly restricted access')
    return []
  }
}

export const getAllIndiaDisasters = async (): Promise<DisasterEvent[]> => {
  const [imd, usgs, rw, ndma] = await Promise.all([
    fetchIMDAlerts(),
    fetchUSGSEarthquakes(),
    fetchReliefWebIndia(),
    fetchNDMAOpenData()
  ])
  
  return [...imd, ...usgs, ...rw, ...ndma]
}
