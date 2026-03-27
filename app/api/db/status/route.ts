import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'local_database.json');

// Auto-seed on first run
export async function GET() {
  try {
    if (!fs.existsSync(DB_FILE) || fs.readFileSync(DB_FILE, 'utf-8').includes('"incidents":[]')) {
      return NextResponse.redirect(new URL('/api/db/seed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return NextResponse.json({ status: 'ok', incidents: data.incidents?.length, rescuers: data.rescuers?.length, survivors: data.survivors?.length });
  } catch {
    return NextResponse.json({ status: 'error' });
  }
}
