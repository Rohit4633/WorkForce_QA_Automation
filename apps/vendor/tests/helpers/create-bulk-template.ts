import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

export interface BulkCandidate {
  firstName: string;
  lastName: string;
  phone: string;
}

export function createBulkUploadTemplate(candidates: BulkCandidate[]): string {
  const wb = XLSX.utils.book_new();
  const headers = [
    'First Name*', 'Last Name*', 'Personal Phone Number*',
    'Nationality*', 'National Identity Type',
    'National Identity Number', 'Is Visa Sponsored By Vendor*'
  ];
  const rows = [
    headers,
    ['e.g. Ziad', 'e.g. Reda', 'e.g. +971501234567', 'Use the dropdown below', 'Use the dropdown below', 'e.g. 784-2001-1234566-1', 'e.g. yes / no'],
    ...candidates.map(c => [
      c.firstName, c.lastName, c.phone, 'India', 'Emirates ID',
      `784-${Math.floor(Math.random() * (2000 - 1960) + 1960)}-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}-${Math.floor(Math.random() * 10)}`,
      'no'
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'bulk-upload-template.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log(`📄 Template created at: ${filePath}`);
  return filePath;
}

// ── Missing mandatory fields template ──────────────────────────────────────
export function createMissingFieldsTemplate(): string {
  const wb = XLSX.utils.book_new();
  const headers = [
    'First Name*', 'Last Name*', 'Personal Phone Number*',
    'Nationality*', 'National Identity Type',
    'National Identity Number', 'Is Visa Sponsored By Vendor*'
  ];
  const rows = [
    headers,
    ['e.g. Ziad', 'e.g. Reda', 'e.g. +971501234567', 'Use the dropdown below', 'Use the dropdown below', 'e.g. 784-2001-1234566-1', 'e.g. yes / no'],
    // Missing First Name and Last Name — mandatory fields empty
    ['', '', '+919812345678', 'India', 'Emirates ID', '784-1990-1234567-1', 'no']
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'missing-fields-template.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log(`📄 Missing fields template created: ${filePath}`);
  return filePath;
}

// ── Duplicate candidate template ───────────────────────────────────────────
export function createDuplicateTemplate(existingPhone: string, existingEmiratesId: string): string {
  const wb = XLSX.utils.book_new();
  const headers = [
    'First Name*', 'Last Name*', 'Personal Phone Number*',
    'Nationality*', 'National Identity Type',
    'National Identity Number', 'Is Visa Sponsored By Vendor*'
  ];
  const rows = [
    headers,
    ['e.g. Ziad', 'e.g. Reda', 'e.g. +971501234567', 'Use the dropdown below', 'Use the dropdown below', 'e.g. 784-2001-1234566-1', 'e.g. yes / no'],
    // Use existing phone/emirates ID to trigger duplicate error
    ['Duplicate', 'Test', existingPhone, 'India', 'Emirates ID', existingEmiratesId, 'no']
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'duplicate-template.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log(`📄 Duplicate template created: ${filePath}`);
  return filePath;
}

// ── Fix error report and create corrected template ─────────────────────────
export function createFixedTemplate(firstName: string, lastName: string, filePrefix = 'fixed'): string {
  const wb = XLSX.utils.book_new();
  const headers = [
    'First Name*', 'Last Name*', 'Personal Phone Number*',
    'Nationality*', 'National Identity Type',
    'National Identity Number', 'Is Visa Sponsored By Vendor*'
  ];
  const suffix = Date.now().toString().slice(-4);
  const rows = [
    headers,
    ['e.g. Ziad', 'e.g. Reda', 'e.g. +971501234567', 'Use the dropdown below', 'Use the dropdown below', 'e.g. 784-2001-1234566-1', 'e.g. yes / no'],
    // Fixed data with all mandatory fields filled
    [
      `${firstName}${suffix}`, lastName,
      `+9198${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      'India', 'Emirates ID',
      `784-${Math.floor(Math.random() * (2000 - 1960) + 1960)}-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}-${Math.floor(Math.random() * 10)}`,
      'no'
    ]
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${filePrefix}-template.xlsx`);
  XLSX.writeFile(wb, filePath);
  console.log(`📄 Fixed template created: ${filePath}`);
  return filePath;
}

export function generateBulkCandidates(count: number): BulkCandidate[] {
  const firstNames = ['Ahmed', 'Sara', 'Omar', 'Layla', 'Khalid', 'Nour', 'Tariq', 'Hana', 'Ziad', 'Rania'];
  const lastNames = ['Hassan', 'Mansour', 'Saleh', 'Nasser', 'Farouk', 'Qasim', 'Amin', 'Ibrahim', 'Yusuf', 'Karim'];
  return Array.from({ length: count }, (_, i) => {
    const suffix = Date.now().toString().slice(-4) + i;
    return {
      firstName: `${firstNames[i % firstNames.length]}${suffix}`,
      lastName: lastNames[i % lastNames.length],
      phone: `+9198${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
    };
  });
}