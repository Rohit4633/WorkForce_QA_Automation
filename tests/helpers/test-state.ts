import * as fs from 'fs';
import * as path from 'path';

const stateFile = path.join(__dirname, '../data/last-created-candidate.json');

export function saveCreatedCandidate(firstName: string, lastName: string, emiratesId: string) {
  const dir = path.dirname(stateFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(stateFile, JSON.stringify({ firstName, lastName, emiratesId }));
  console.log(`💾 Saved candidate: ${firstName} ${lastName} | Emirates ID: ${emiratesId}`);
}

export function loadCreatedCandidate(): { firstName: string; lastName: string; emiratesId: string } {
  if (!fs.existsSync(stateFile)) {
    throw new Error('No candidate found — run create-candidate.spec.ts first');
  }
  return JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
}