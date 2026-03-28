import { NextResponse } from 'next/server';
import { auth, db, admin } from '@/lib/firebase-admin'; // Use admin SDK for seeding

export async function GET() {
  try {
    // 4. Role-Based Auth Seed Fix
    if (!admin.apps.length) throw new Error('Firebase Admin not initialized - please set env variables');

    const email = 'admin@resqmap.in';
    const password = 'ResQMap@2024';

    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log('Admin user already exists');
    } catch (e) {
      user = await auth.createUser({
        email,
        password,
        displayName: 'System Administrator',
      });
      console.log('Created admin user');
    }

    // Ensure Firestore document exists with role admin
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email,
      name: 'System Administrator',
      role: 'admin',
      agency: 'NDMA Command',
      isActive: true,
      createdAt: new Date(),
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Admin seeded successfully (admin@resqmap.in / ResQMap@2024)' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
