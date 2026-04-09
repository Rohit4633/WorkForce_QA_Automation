export function randomFirstName(): string {
  const names = [
    'Farjad', 'Tayyab', 'Yousra', 'Ziad', 'Omar', 'Nuwan', 'Mohammad', 'Loubna', 'Rohit',
    'Ahmed', 'Ali', 'Fatima', 'Sara', 'Khalid', 'Layla', 'Nour', 'Rania', 'Tariq', 'Hana',
    'Kareem', 'Dina', 'Walid', 'Mona', 'Samir', 'Rana', 'Yousef', 'Lina', 'Hassan', 'Maya',
    'Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Rohan', 'Kavya', 'Arjun', 'Pooja',
    'Raj', 'Neha', 'Sanjay', 'Divya', 'Nikhil', 'Shreya', 'Arun', 'Meera', 'Karan', 'Riya',
    'James', 'Emma', 'Oliver', 'Sophia', 'William', 'Isabella', 'Noah', 'Mia', 'Lucas', 'Ava',
    'Ethan', 'Charlotte', 'Liam', 'Amelia', 'Mason', 'Harper', 'Logan', 'Evelyn', 'Jack', 'Ella',
    'Wei', 'Mei', 'Jin', 'Ying', 'Siti', 'Ahmad', 'Nur', 'Amir', 'Fatimah',
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = Date.now().toString().slice(-4);
  return `${name}${suffix}`;
}

export function randomLastName(): string {
  const names = [
    'Ilyas', 'Nawaz', 'Hassan', 'Reda', 'Zakaria', 'Dharmapala', 'ElHagry', 'Radi', 'Mangla',
    'Al-Rashid', 'Khalil', 'Mansour', 'Saleh', 'Nasser', 'Farouk', 'Qasim', 'Jabir', 'Amin',
    'Mustafa', 'Ibrahim', 'Yusuf', 'Hamid', 'Karim', 'Aziz', 'Rahman', 'Malik', 'Shah',
    'Sharma', 'Verma', 'Singh', 'Patel', 'Kumar', 'Gupta', 'Mehta', 'Joshi', 'Kapoor', 'Mishra',
    'Agarwal', 'Chaudhary', 'Yadav', 'Pandey', 'Tiwari', 'Sinha', 'Dubey', 'Chauhan', 'Bose',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson',
    'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Moore',
    'Tan', 'Lee', 'Wong', 'Lim', 'Chen', 'Wang', 'Zhang', 'Liu', 'Yang', 'Huang',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export function randomPhoneNumber(): string {
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `98${suffix}`;
}

export function randomEmiratesId(): string {
  const year = Math.floor(Math.random() * (2000 - 1960) + 1960);
  const mid = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  const last = Math.floor(Math.random() * 10);
  return `784-${year}-${mid}-${last}`;
}
