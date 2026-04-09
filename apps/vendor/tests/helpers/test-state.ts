import * as fs from 'fs';
import * as path from 'path';

const STATE_FILE = path.join(__dirname, '../data/last-created-candidate.json');

interface CandidateState {
  firstName: string;
  lastName: string;
  emiratesId: string;
  phone: string;
  passportNumber?: string;
}

// ── Save candidate after creation ─────────────────────────────────────────────
export function saveCreatedCandidate(
  firstName: string,
  lastName: string,
  emiratesId: string,
  phone: string
) {
  const state: CandidateState = { firstName, lastName, emiratesId, phone };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(`💾 Saved candidate state: ${firstName} ${lastName}`);
}

// ── Save passport number after Test 2 adds it ─────────────────────────────────
export function savePassportNumber(passportNumber: string) {
  const existing = loadCreatedCandidate();
  const updated: CandidateState = { ...existing, passportNumber };
  fs.writeFileSync(STATE_FILE, JSON.stringify(updated, null, 2));
  console.log(`💾 Saved passport number: ${passportNumber}`);
}

// ── Load candidate state ──────────────────────────────────────────────────────
export function loadCreatedCandidate(): CandidateState {
  if (!fs.existsSync(STATE_FILE)) {
    console.warn('⚠️ No candidate state file found — using defaults');
    return { firstName: 'Unknown', lastName: 'Unknown', emiratesId: '', phone: '' };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
}

// ── Load passport number ──────────────────────────────────────────────────────
export function loadPassportNumber(): string {
  const state = loadCreatedCandidate();
  if (!state.passportNumber) {
    throw new Error('No passport number found in state — ensure Test 2 ran first');
  }
  return state.passportNumber;
}