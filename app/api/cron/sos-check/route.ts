import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';

export async function GET(req: Request) {
  // 7. SOS ESCALATION TIMER (API Implementation)
  try {
    const now = Date.now();
    const threeMinutesAgo = now - (3 * 60 * 1000);
    
    // Find pending SOS beacons older than 3 mins
    const sosRef = db.collection('sos_beacons');
    const snapshot = await sosRef
      .where('status', '==', 'pending')
      .where('createdAt', '<', new Date(threeMinutesAgo))
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, message: 'No SOS beacons to escalate' });
    }

    const batch = db.batch();
    const notifications = db.collection('notifications');
    const logs: string[] = [];

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      
      // Update SOS document
      batch.update(docSnap.ref, {
        status: 'escalated',
        escalatedAt: admin.firestore.FieldValue.serverTimestamp(),
        escalationCount: (data.escalationCount || 0) + 1,
        priority: 'critical'
      });

      // Notify all dispatchers
      const notifRef = notifications.doc();
      batch.set(notifRef, {
        type: 'SOS',
        urgency: 'critical',
        title: 'AUTOMATIC ESCALATION',
        message: `SOS Beacon ${docSnap.id} has reached 3 minute threshold without dispatcher response. ESCALATED TO REGIONAL HQ.`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });

      logs.push(`Escalated SOS: ${docSnap.id}`);
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      escalatedCount: snapshot.size,
      logs
    });

  } catch (error: any) {
    console.error('SOS Escalation Cron Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
