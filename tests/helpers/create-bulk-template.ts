 import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

export interface BulkCandidate {
  firstName: string;
  lastName: string;
  phone: string;
}

export function createBulkUploadTemplate(candidates: BulkCandidate[]): string {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Header row matching exact template columns
  const headers = [
    'First Name*',
    'Last Name*',
    'Personal Phone Number*',
    'Nationality*',
    'National Identity Type',
    'National Identity Number',
    'Is Visa Sponsored By Vendor*'
  ];

  // Build rows
  const rows = [
    headers,
    // Example row (same as template)
    ['e.g. Ziad', 'e.g. Reda', 'e.g. +971501234567', 'Use the dropdown below', 'Use the dropdown below', 'e.g. 784-2001-1234566-1', 'e.g. yes / no'],
    // Actual data rows
    ...candidates.map(c => [
      c.firstName,
      c.lastName,
      c.phone,
      'India',
      'Emirates ID',
      `784-${Math.floor(Math.random() * (2000 - 1960) + 1960)}-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}-${Math.floor(Math.random() * 10)}`,
      'no'
    ])
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Save to temp file
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, 'bulk-upload-template.xlsx');
  XLSX.writeFile(wb, filePath);

  console.log(`📄 Template created at: ${filePath}`);
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
