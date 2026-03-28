import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'local_database.json');

function readDb() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch { return {}; }
}
function writeDb(data: any) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

export async function POST() {
  try {
    const db = readDb();
    db.rescuers = db.rescuers || [];
    let changed = false;

    db.rescuers = db.rescuers.map((d: any) => {
      if (d.status === 'busy') {
        d.fuelPct = Math.max(0, (d.fuelPct ?? 100) - 0.5);
        if (d.fuelPct < 15) d.status = 'returning';
        changed = true;
      } else if (d.status === 'returning') {
        d.fuelPct = Math.min(100, (d.fuelPct ?? 0) + 2);
        if (d.fuelPct >= 100) d.status = 'available';
        changed = true;
      } else if (d.status === 'charging') {
        d.fuelPct = Math.min(100, (d.fuelPct ?? 0) + 1);
        if (d.fuelPct >= 100) d.status = 'available';
        changed = true;
      }
      return d;
    });

    if (changed) writeDb(db);
    return NextResponse.json({ success: true, units: db.rescuers.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
