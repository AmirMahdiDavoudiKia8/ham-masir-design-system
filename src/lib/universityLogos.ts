/**
 * Maps a mentor's `university` field (as stored in mentors.json) to a crest
 * image for the faint watermark behind their profile banner. Keyed by the
 * exact strings the data uses today — medicine/dentistry mentors under
 * "تهران"/"اراک"/"شهید بهشتی"/"اصفهان" are really at that city's medical-
 * sciences university, so those point at the med-school crest, not the
 * general university's.
 */
const UNIVERSITY_LOGOS: Record<string, string> = {
  "شریف": "/universities/sharif.jpg",
  "تهران": "/universities/tehran.svg",
  "دانشگاه تهران": "/universities/tehran.svg",
  "امیرکبیر": "/universities/amirkabir.png",
  "علم و صنعت": "/universities/iust.png",
  "فردوسی مشهد": "/universities/ferdowsi-mashhad.jpg",
  "شهید بهشتی": "/universities/shahid-beheshti-medical.svg",
  "اصفهان": "/universities/isfahan-medical.svg",
  "اراک": "/universities/arak-medical.jpg",
};

export function getUniversityLogo(university?: string): string | undefined {
  if (!university) return undefined;
  return UNIVERSITY_LOGOS[university.trim()];
}

/**
 * The picker list for mentor self-registration (see MentorProfileForm) —
 * one entry per distinct crest, using "دانشگاه تهران" over its "تهران"
 * alias since it reads better as a button label. Picking one stores the
 * exact key so getUniversityLogo keeps finding it later.
 */
export const UNIVERSITY_OPTIONS: { name: string; logo: string }[] = [
  { name: "شریف", logo: "/universities/sharif.jpg" },
  { name: "دانشگاه تهران", logo: "/universities/tehran.svg" },
  { name: "امیرکبیر", logo: "/universities/amirkabir.png" },
  { name: "علم و صنعت", logo: "/universities/iust.png" },
  { name: "فردوسی مشهد", logo: "/universities/ferdowsi-mashhad.jpg" },
  { name: "شهید بهشتی", logo: "/universities/shahid-beheshti-medical.svg" },
  { name: "اصفهان", logo: "/universities/isfahan-medical.svg" },
  { name: "اراک", logo: "/universities/arak-medical.jpg" },
];
