export interface Leader {
  name: string;
  role: string;
  chapter?: string;
  quote?: string;
  color: string;
}

export const prosperLeaders: Leader[] = [
  { name: "Manav A.", role: "Co-Founder & Overall Chair · Tech Lead & Architecture Developer", chapter: "President · Prosper High School", quote: "Building a legacy.", color: "bg-blue-500" },
  { name: "Shaurya J.", role: "Co-Founder & Overall Chair", chapter: "President · Prosper High School", quote: "Efficiency is key.", color: "bg-purple-500" },
  { name: "Aakanksh R.", role: "Co-Founder & Overall Chair", chapter: "President · Prosper High School", quote: "Connecting minds.", color: "bg-green-500" },
  { name: "Arnav Shah", role: "President of Growth and Expansion · Prosper High School", quote: "Connection is absolute.", color: "bg-blue-500" },
];

export const registrarLeaders: Leader[] = [
  { name: "Aumik Mehra", role: "VP of Next Generation Leaders", chapter: "Prosper High School", quote: "Empowering the next generation.", color: "bg-purple-500" },
  { name: "Yohaan M.", role: "Vice President of Chapter Analytics", chapter: "Prosper High School", quote: "Unity is Key", color: "bg-purple-500" },
  { name: "Amulya Singh", role: "Multi-campus Attendance Analyst & Engineer", chapter: "Prosper High School", color: "bg-green-500" },
  { name: "Alwin John SV", role: "Co-Founder & Overall Chair", chapter: "President · Richland High School", quote: "Expanding horizons.", color: "bg-orange-500" },
  { name: "Arnav Chugh", role: "President · Ranchview High School", quote: "Learning grows through community.", color: "bg-purple-500" },
  { name: "Sreedatta Gudapudi", role: "President · V.R. Eaton High School", quote: "Helping students thrive.", color: "bg-green-500" },
  { name: "Jeet Bhandhari", role: "President · Mansfield High School", quote: "Making support accessible.", color: "bg-orange-500" },
  { name: "Austin Hodge", role: "President · Bridgeland High School", color: "bg-blue-500" },
  { name: "Rishit Shinkar", role: "Treasurer · Bridgeland High School", quote: "Building a stronger school community.", color: "bg-blue-500" },
];
