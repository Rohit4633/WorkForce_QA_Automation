import * as fs from 'fs';
import * as path from 'path';

export interface VendorCandidate {
  firstName: string;
  lastName: string;
  emiratesId: string;
  phone: string;
  passportNumber?: string;
}

/**
 * Reads the last created candidate from the vendor app's test state file.
 * Falls back to env vars if the file is not found.
 */
export function loadVendorCandidate(): VendorCandidate {
  try {
    const dataPath = path.resolve(
      __dirname,
      '../../../vendor/tests/data/last-created-candidate.json'
    );
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw) as VendorCandidate;
  } catch {
    // Fallback — use env vars if file is unavailable
    return {
      firstName: process.env.CANDIDATE_FIRST_NAME || '',
      lastName:  process.env.CANDIDATE_LAST_NAME  || '',
      emiratesId: process.env.CANDIDATE_EMIRATES_ID || '',
      phone:     process.env.CHECKLIST_PHONE       || '',
    };
  }
}
