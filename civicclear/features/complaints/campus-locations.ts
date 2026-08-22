/** Campus sites for student issue reports (replaces GPS/map pin). */
export const CAMPUS_LOCATIONS = [
  "TP1 (Tech Park 1)",
  "TP2 (Tech Park 2)",
  "UB (University Building)",
  "Architecture block",
  "MBA block",
  "Biotech block",
  "Java Canteen",
  "Vendhar Square",
] as const;

export type CampusLocation = (typeof CAMPUS_LOCATIONS)[number];

export function isCampusLocation(value: string): value is CampusLocation {
  return (CAMPUS_LOCATIONS as readonly string[]).includes(value);
}
