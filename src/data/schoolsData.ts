export interface School {
  id: string;
  name: string;
  city: string;
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB / Cambridge' | 'Other';
}

export const POPULAR_SCHOOLS: School[] = [
  { id: 'dps-rkp', name: 'Delhi Public School (DPS RK Puram)', city: 'New Delhi', board: 'CBSE' },
  { id: 'dps-noida', name: 'Delhi Public School (DPS Noida)', city: 'Noida', board: 'CBSE' },
  { id: 'dps-blr', name: 'Delhi Public School (DPS Bangalore South)', city: 'Bengaluru', board: 'CBSE' },
  { id: 'kv-iit', name: 'Kendriya Vidyalaya (KV IIT Campus)', city: 'Chennai', board: 'CBSE' },
  { id: 'kv-delhi', name: 'Kendriya Vidyalaya (KV Andrews Ganj)', city: 'New Delhi', board: 'CBSE' },
  { id: 'st-xaviers-kol', name: "St. Xavier's Collegiate School", city: 'Kolkata', board: 'ICSE' },
  { id: 'st-xaviers-mum', name: "St. Xavier's High School", city: 'Mumbai', board: 'State Board' },
  { id: 'nps-indiranagar', name: 'National Public School (NPS Indiranagar)', city: 'Bengaluru', board: 'CBSE' },
  { id: 'mothers-intl', name: "The Mother's International School", city: 'New Delhi', board: 'CBSE' },
  { id: 'sanskriti', name: 'Sanskriti School (Chanakyapuri)', city: 'New Delhi', board: 'CBSE' },
  { id: 'modern-school', name: 'Modern School (Barakhamba Road)', city: 'New Delhi', board: 'CBSE' },
  { id: 'bombay-scottish', name: 'Bombay Scottish School (Mahim)', city: 'Mumbai', board: 'ICSE' },
  { id: 'dav-chandigarh', name: 'DAV Public School', city: 'Chandigarh', board: 'CBSE' },
  { id: 'la-martiniere-kol', name: 'La Martiniere for Boys', city: 'Kolkata', board: 'ICSE' },
  { id: 'don-bosco-delhi', name: 'Don Bosco School (Alaknanda)', city: 'New Delhi', board: 'CBSE' },
  { id: 'bishop-cotton-blr', name: 'Bishop Cotton Boys School', city: 'Bengaluru', board: 'ICSE' },
  { id: 'ryan-intl', name: 'Ryan International School', city: 'Mumbai', board: 'CBSE' },
  { id: 'springdales', name: 'Springdales School (Dhaula Kuan)', city: 'New Delhi', board: 'CBSE' },
  { id: 'podar-intl', name: 'Podar International School', city: 'Pune', board: 'CBSE' },
  { id: 'army-public-school', name: 'Army Public School (Dhaula Kuan)', city: 'New Delhi', board: 'CBSE' },
  { id: 'loyola-school', name: 'Loyola School', city: 'Jamshedpur', board: 'ICSE' },
  { id: 'st-columbas', name: "St. Columba's School", city: 'New Delhi', board: 'CBSE' },
  { id: 'oakridge-intl', name: 'Oakridge International School', city: 'Hyderabad', board: 'IB / Cambridge' },
  { id: 'dhdirubhai-ambani', name: 'Dhirubhai Ambani International School', city: 'Mumbai', board: 'IB / Cambridge' },
];

export const SCHOOL_BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB / Cambridge', 'Other'] as const;
