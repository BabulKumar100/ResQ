import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'local_database.json');

export async function GET() {
  return NextResponse.json({ message: 'POST to this endpoint to seed the database' });
}

export async function POST() {
  try {
    const db = {
      incidents: [
        { id: 'm1', type: 'Chemical Spill', severity: 'critical', lat: 34.048, lng: -118.25, address: 'Industrial Sector 4', description: 'Toxic plume detected. Evac required.', source: 'sensor', status: 'new', reportedBy: 'system', createdAt: new Date().toISOString() },
        { id: 'm2', type: 'Subway Derailment', severity: 'critical', lat: 34.053, lng: -118.245, address: 'Blue Line Downtown', description: 'Train derailed, structure damaged.', source: 'manual', status: 'new', reportedBy: 'user', createdAt: new Date().toISOString() },
        { id: 'm3', type: 'Bridge Stress', severity: 'high', lat: 34.06, lng: -118.23, address: '4th St Bridge', description: 'Abnormal vibrations detected.', source: 'sensor', status: 'new', reportedBy: 'system', createdAt: new Date().toISOString() },
      ],
      rescuers: [
        { id: 'd1', userId: 'drone1', name: 'DRONE-7 ALPHA', role: 'rescuer', lat: 34.05, lng: -118.24, status: 'busy', agency: 'Air Unit', fuelPct: 84, crewCount: 0, equipment: ['drone'] },
        { id: 'd2', userId: 'drone2', name: 'ROVER GRID-X', role: 'rescuer', lat: 34.055, lng: -118.25, status: 'busy', agency: 'Ground Unit', fuelPct: 18, crewCount: 0, equipment: ['rover'] },
        { id: 'r1', userId: 'resc1', name: 'MEDVAC B', role: 'rescuer', lat: 34.051, lng: -118.23, status: 'available', agency: 'Medical', fuelPct: 100, crewCount: 4, equipment: ['trauma kit'] },
      ],
      resources: [
        { id: 'res1', name: 'DEPOT OMEGA', location: 'SECTOR 4', distance: '1.2km', type: 'MEDICAL', status: 'CRITICAL', createdAt: new Date().toISOString() },
        { id: 'res2', name: 'HUB ALPHA', location: 'SECTOR 1', distance: '3.4km', type: 'MULTI', status: 'OPERATIONAL', createdAt: new Date().toISOString() },
        { id: 'res3', name: 'FIELD BASE CHARLIE', location: 'SECTOR 2', distance: '5.1km', type: 'WATER', status: 'WARNING', createdAt: new Date().toISOString() },
      ],
      danger_zones: [
        { id: 'dz1', type: 'Fire Spread Vector', status: 'MONITORING', radius: 1200, riskLevel: 'HIGH', description: 'Fire moving NNE at 45km/h due to wind shear.', active: true, createdAt: new Date().toISOString() }
      ],
      survivors: [
        { id: 's1', qrCode: 'SV-A1B2', name: 'John Doe', age: 34, status: 'injured', lat: 34.045, lng: -118.255, notes: 'Triage: RED. Chemical burns.', updatedAt: new Date().toISOString() },
        { id: 's2', qrCode: 'SV-C3D4', name: 'Jane Smith', age: 28, status: 'rescued', lat: 34.041, lng: -118.251, notes: 'Triage: YELLOW. Minor abrasions.', updatedAt: new Date().toISOString() },
        { id: 's3', qrCode: 'SV-E5F6', name: 'Carlos Mendez', age: 45, status: 'critical', lat: 34.057, lng: -118.239, notes: 'Triage: BLACK. Severe trauma.', updatedAt: new Date().toISOString() },
      ],
      sos_beacons: [
        { id: 'sos1', userId: 'civilian-x', lat: 34.047, lng: -118.252, type: 'medical', urgency: 'critical', status: 'active', createdAt: new Date().toISOString() },
      ],
      live_events: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
