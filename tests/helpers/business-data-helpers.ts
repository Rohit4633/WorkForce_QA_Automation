export function randomContactTitle(): string {
  const titles = ['Manager', 'Director', 'Coordinator', 'Supervisor', 'Officer', 'Executive'];
  const suffix = Date.now().toString().slice(-4);
  return `${titles[Math.floor(Math.random() * titles.length)]}${suffix}`;
}

export function randomContactName(): string {
  const firstNames = ['Ahmed', 'Sara', 'Omar', 'Layla', 'Khalid', 'Nour', 'Tariq', 'Hana'];
  const lastNames = ['Hassan', 'Mansour', 'Saleh', 'Nasser', 'Farouk', 'Qasim'];
  const suffix = Date.now().toString().slice(-4);
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]}${suffix} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

export function randomContactPhone(): string {
  // UAE mobile numbers: 9 digits starting with 50, 52, 54, 55, 56, 58
  const prefixes = ['50', '52', '54', '55', '56', '58'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
}

export function randomContactEmail(): string {
  const suffix = Date.now().toString().slice(-6);
  return `contact${suffix}@testmail.com`;
}