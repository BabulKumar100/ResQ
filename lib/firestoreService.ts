export type Incident = { id?: string; type: string; severity: string; lat: number; lng: number; address: string; description?: string; source: string; status: string; reportedBy: string; };
export type SOSBeacon = { id?: string; userId?: string; lat: number; lng: number; type: string; urgency: string; status: string; };
export type DangerZone = { id?: string; type: string; status: string; radius: number; riskLevel: string; description: string; active?: boolean; };
export type Survivor = { id?: string; qrCode: string; name: string; age: number; status: string; lat: number; lng: number; notes: string; };
export type LiveEvent = { id?: string; type: string; message: string; severity: string; locationName: string; };
export type Rescuer = { id?: string; userId: string; name: string; role: string; lat: number; lng: number; status: string; agency: string; fuelPct: number; crewCount: number; equipment: string[]; };

export const createIncident = async (data: any) => {
  return await fetch('/api/db/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const updateIncidentSeverity = async (incidentId: string, severity: string) => {
  console.log('Update Incident Severity mock', incidentId, severity);
};

export const createSOSBeacon = async (data: any) => {
  return await fetch('/api/db/sos_beacons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const createDangerZone = async (data: any) => {
  return await fetch('/api/db/danger_zones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

export const upsertSurvivor = async (qrCodeOrData: any, extraData?: any) => {
  const payload = extraData ? { qrCode: qrCodeOrData, ...extraData } : qrCodeOrData;
  return await fetch('/api/db/survivors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
