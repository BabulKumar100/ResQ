import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'local_database.json');

const DEFAULT_DB: Record<string, any[]> = {
  incidents: [], rescuers: [], resources: [], danger_zones: [], survivors: [], live_events: [], sos_beacons: []
};

const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) return DEFAULT_DB;
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch { return DEFAULT_DB; }
};

const writeDb = (data: any) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const db = readDb();
  const data = db[collection] ?? [];
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' }
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const body = await request.json();
  const db = readDb();
  if (!db[collection]) db[collection] = [];
  const id = body.id || Math.random().toString(36).substring(2, 9);
  const newDoc = { ...body, id, createdAt: new Date().toISOString() };
  const existingIdx = db[collection].findIndex((d: any) => d.id === id);
  if (existingIdx >= 0) db[collection][existingIdx] = newDoc;
  else db[collection].push(newDoc);
  writeDb(db);
  return NextResponse.json({ success: true, data: newDoc });
}
