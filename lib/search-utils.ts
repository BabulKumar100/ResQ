import { db } from './firebase'
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'
import axios from 'axios'
import { fetchReliefWebIndia } from './indiaDisasterData'

export interface SearchResult {
  id: string
  title: string
  category: 'Active Incidents' | 'India Disasters' | 'Districts' | 'States' | 'Live Events'
  lat: number
  lng: number
  severity?: string
  distance?: string
  source?: string
  timestamp?: string
}

const INDIA_DISTRICTS_URL = 'https://raw.githubusercontent.com/datameet/maps/master/Districts/india-districts.geojson'
let districtCache: any = null

export const searchAllSources = async (searchTerm: string): Promise<SearchResult[]> => {
  if (!searchTerm || searchTerm.length < 3) return []
  const term = searchTerm.toLowerCase()

  try {
    const results: SearchResult[] = []

    // 1. Firebase /incidents
    const incSnap = await getDocs(query(collection(db, 'incidents'), limit(20)))
    incSnap.docs.forEach(doc => {
      const data = doc.data()
      if (data.title?.toLowerCase().includes(term) || data.description?.toLowerCase().includes(term)) {
        results.push({
          id: doc.id,
          title: data.title,
          category: 'Active Incidents',
          lat: data.lat,
          lng: data.lng,
          severity: data.severity,
          source: 'ResQMap Internal'
        })
      }
    })

    // 2. Firebase /live_events
    const liveSnap = await getDocs(query(collection(db, 'live_events'), limit(10)))
    liveSnap.docs.forEach(doc => {
      const data = doc.data()
      if (data.title?.toLowerCase().includes(term)) {
        results.push({
          id: doc.id,
          title: data.title,
          category: 'Live Events',
          lat: data.lat,
          lng: data.lng,
          source: data.source || 'Official Feed'
        })
      }
    })

    // 3. India Districts GeoJSON (Search by District/State name)
    if (!districtCache) {
      districtCache = await fetch(INDIA_DISTRICTS_URL).then(res => res.json())
    }
    
    districtCache.features.forEach((f: any) => {
      const dName = (f.properties.NAME || f.properties.district || '').toLowerCase()
      const sName = (f.properties.STATE || f.properties.state || '').toLowerCase()
      
      if (dName.includes(term)) {
        results.push({
          id: `dist-${f.properties.ID || dName}`,
          title: `${f.properties.NAME || f.properties.district}`,
          category: 'Districts',
          lat: f.properties.lat || 20.5937,
          lng: f.properties.lng || 78.9629,
          source: `${f.properties.STATE || f.properties.state || 'India'}`
        })
      } else if (sName.includes(term) && !results.find(r => r.title === sName)) {
         results.push({
          id: `state-${sName}`,
          title: `${f.properties.STATE || f.properties.state}`,
          category: 'States',
          lat: 20.5937,
          lng: 78.9629,
          source: 'India Administrative Unit'
        })
      }
    })

    // 4. ReliefWeb India API (External Keyword Search)
    const rwDisasters = await fetchReliefWebIndia()
    rwDisasters.forEach(d => {
      if (d.title.toLowerCase().includes(term)) {
        results.push({
          id: d.id,
          title: d.title,
          category: 'India Disasters',
          lat: d.latitude,
          lng: d.longitude,
          severity: d.severity,
          source: 'ReliefWeb'
        })
      }
    })

    return results.slice(0, 50) // Cap results for performance
  } catch (error) {
    console.error('Search Engine error:', error)
    return []
  }
}
