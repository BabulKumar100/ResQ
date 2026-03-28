import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'local_database.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) return { incidents: [], rescuers: [], resources: [], danger_zones: [], survivors: [], sos_beacons: [], live_events: [] };
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch { return { incidents: [], rescuers: [], resources: [], danger_zones: [], survivors: [], sos_beacons: [], live_events: [] }; }
}

function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    // Fetch USGS real earthquake data (last hour)
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson', {
      next: { revalidate: 300 }
    });
    
    if (!res.ok) return NextResponse.json({ error: 'USGS unavailable' }, { status: 502 });
    
    const usgsData = await res.json();
    const db = readDb();
    const existingIds = new Set(db.incidents.map((i: any) => i.external_id).filter(Boolean));
    let added = 0;

    for (const feature of usgsData.features?.slice(0, 5) || []) {
      const extId = `usgs-${feature.id}`;
      if (existingIds.has(extId)) continue;

      const mag = feature.properties.mag || 0;
      const severity = mag >= 5 ? 'critical' : mag >= 3 ? 'high' : 'medium';

      const newIncident = {
        id: Math.random().toString(36).substring(2, 9),
        external_id: extId,
        type: `Earthquake M${mag.toFixed(1)}`,
        title: feature.properties.title || `EQ M${mag.toFixed(1)}`,
        severity,
        status: 'new',
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        address: feature.properties.place || 'Unknown Location',
        description: `Magnitude ${mag} earthquake detected. Depth: ${feature.geometry.coordinates[2]}km.`,
        source: 'USGS',
        reportedBy: 'system',
        incidentCode: `EQ-${Date.now().toString(36).toUpperCase().slice(-4)}`,
        createdAt: new Date(feature.properties.time).toISOString(),
      };

      db.incidents.push(newIncident);
      existingIds.add(extId);
      added++;
    }

    if (added > 0) writeDb(db);

    return NextResponse.json({ 
      success: true, 
      added, 
      total: db.incidents.length,
      message: `Synced ${added} new events from USGS`
    }, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    console.error('Feed sync error:', error);
    return NextResponse.json({ error: 'Sync failed', details: String(error) }, { status: 500 });
  }
}
