 
export function randomFirstName(): string {
    const names = ['Farjad', 'Tayyab', 'Yousra', 'Ziad', 'Omar', 'Nuwan', 'Mohammad', 'Loubna','Rohit'];
    return names[Math.floor(Math.random() * names.length)];
  }
  
  export function randomLastName(): string {
    const names = ['Ilyas', 'Nawaz', 'Hassan', 'Reda', 'Zakaria', 'Dharmapala', 'ElHagry', 'Radi','Mangla'];
    return names[Math.floor(Math.random() * names.length)];
  }
  
  export function randomPhoneNumber(): string {
    // Starts with 98, followed by 8 random digits = 10 digits total
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `98${suffix}`;
  }
  
  export function randomEmiratesId(): string {
    // Format: 784-YYYY-XXXXXXX-X (15 digits total)
    const year = Math.floor(Math.random() * (2000 - 1960) + 1960);
    const mid = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    const last = Math.floor(Math.random() * 10);
    return `784-${year}-${mid}-${last}`;
  }