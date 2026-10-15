// Campus coordinates from OpenStreetMap; Richland is the Prosper ISD campus.
// Keep the California Cypress campus distinct from the Cypress-area Texas schools.
export const chapterLocations = [
  { name: 'Prosper High School', city: 'Prosper, TX', coordinates: [33.25945, -96.79842], region: 'North Texas', members: '312' },
  { name: 'Richland High School', city: 'Prosper, TX', coordinates: [33.22638, -96.85655], region: 'North Texas', members: '218' },
  { name: 'Ranchview High School', city: 'Irving, TX', coordinates: [32.91909, -96.94694], region: 'North Texas', members: '127' },
  { name: 'Mansfield High School', city: 'Mansfield, TX', coordinates: [32.57441, -97.09053], region: 'North Texas', members: '97' },
  { name: 'Bridgeland High School', city: 'Cypress, TX', coordinates: [29.93302, -95.76003], region: 'Houston area', members: '132' },
  { name: 'Cypress High School', city: 'Cypress, CA', coordinates: [33.82073, -118.0305], region: 'California', members: '71' },
  { name: 'Cypress Lakes High School', city: 'Katy, TX', coordinates: [29.85426, -95.70339], region: 'Houston area', members: '151' },
  { name: 'Langham Creek High School', city: 'Houston, TX', coordinates: [29.8821, -95.67719], region: 'Houston area', members: '~91' },
] satisfies { name: string; city: string; coordinates: [number, number]; region: string; members: string }[];
