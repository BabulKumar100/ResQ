import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'local_database.json');

// Define default schema collections
const DEFAULT_DB = {
  incidents: [],
  rescuers: [],
  resources: [],
  danger_zones: [],
  survivors: [],
  live_events: [],
};

// Ensure database file exists
const initDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
  }
};

export const readDb = () => {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse local DB', error);
    return DEFAULT_DB;
  }
};

export const writeDb = (data: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write local DB', error);
    return false;
  }
};

export const getCollection = (collection: string) => {
  const db = readDb();
  return db[collection] || [];
};

export const insertDocument = (collectionName: string, doc: any) => {
  const db = readDb();
  if (!db[collectionName]) {
    db[collectionName] = [];
  }
  
  const id = doc.id || Math.random().toString(36).substring(2, 9);
  const newDoc = { ...doc, id, createdAt: new Date().toISOString() };
  
  // Upsert logic if id exists
  const existingIdx = db[collectionName].findIndex((d: any) => d.id === newDoc.id);
  if (existingIdx >= 0) {
    db[collectionName][existingIdx] = newDoc;
  } else {
    db[collectionName].push(newDoc);
  }
  
  writeDb(db);
  return newDoc;
};

export const seedDatabase = () => {
  const db = readDb();
  db.incidents = [
    { id: 'm1', type: 'Chemical Spill', severity: 'critical', lat: 34.048, lng: -118.25, address: 'Industrial Sector 4', description: 'Toxic plume detected. Evac required.', source: 'sensor', status: 'new', reportedBy: 'system', createdAt: new Date().toISOString() },
    { id: 'm2', type: 'Subway Derailment', severity: 'critical', lat: 34.053, lng: -118.245, address: 'Blue Line Downtown', description: 'Train derailed, structure damaged.', source: 'manual', status: 'new', reportedBy: 'user', createdAt: new Date().toISOString() },
    { id: 'm3', type: 'Bridge Stress', severity: 'high', lat: 34.06, lng: -118.23, address: '4th St Bridge', description: 'Abnormal vibrations detected.', source: 'sensor', status: 'new', reportedBy: 'system', createdAt: new Date().toISOString() },
  ];
  db.rescuers = [
    { id: 'd1', userId: 'drone1', name: 'DRONE-7 ALPHA', role: 'rescuer', lat: 34.05, lng: -118.24, status: 'busy', agency: 'Air Unit', fuelPct: 84, crewCount: 0, equipment: ['drone'] },
    { id: 'd2', userId: 'drone2', name: 'ROVER GRID-X', role: 'rescuer', lat: 34.055, lng: -118.25, status: 'busy', agency: 'Ground Unit', fuelPct: 18, crewCount: 0, equipment: ['rover'] },
    { id: 'r1', userId: 'resc1', name: 'MEDVAC B', role: 'rescuer', lat: 34.051, lng: -118.23, status: 'available', agency: 'Medical', fuelPct: 100, crewCount: 4, equipment: ['trauma kit'] },
  ];
  db.resources = [
    { id: 'res1', name: 'DEPOT OMEGA', location: 'SECTOR 4', distance: '1.2km', type: 'MEDICAL', status: 'CRITICAL', createdAt: new Date().toISOString() },
    { id: 'res2', name: 'HUB ALPHA', location: 'SECTOR 1', distance: '3.4km', type: 'MULTI', status: 'OPERATIONAL', createdAt: new Date().toISOString() },
  ];
  db.danger_zones = [
    { id: 'dz1', type: 'Fire Spread Vector', status: 'MONITORING', radius: 1200, riskLevel: 'HIGH', description: 'Fire moving NNE at 45km/h due to wind shear.', active: true, createdAt: new Date().toISOString() }
  ];
  db.survivors = [
    { id: 's1', qrCode: 'SV-A1B2', name: 'John Doe', age: 34, status: 'injured', lat: 34.045, lng: -118.255, notes: 'Triage: RED. Chemical burns.', updatedAt: new Date().toISOString() },
    { id: 's2', qrCode: 'SV-C3D4', name: 'Jane Smith', age: 28, status: 'rescued', lat: 34.041, lng: -118.251, notes: 'Triage: YELLOW. Minor abrasions.', updatedAt: new Date().toISOString() },
  ];
  writeDb(db);
  return db;
};
