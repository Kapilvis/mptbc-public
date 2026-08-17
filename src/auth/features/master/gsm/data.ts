export const mockGsms: Master.GsmItem[] = [
  {
    gsmId: 1,
    gsm: 58,
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    area: 0.48552,
    sheetWeightInGM: 28.16,
    reamWeightInKG: 14.08,
    isActive: true,
  },
  {
    gsmId: 2,
    gsm: 60,
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    area: 0.48552,
    sheetWeightInGM: 29.13,
    reamWeightInKG: 14.56,
    isActive: true,
  },
  {
    gsmId: 3,
    gsm: 70,
    reelWidth: 84,
    cutoff: 578,
    sheetSize: "57.8 × 84",
    area: 0.48552,
    sheetWeightInGM: 33.9864,
    reamWeightInKG: 16.9932,
    isActive: true,
  },
  {
    gsmId: 4,
    gsm: 80,
    reelWidth: 84,
    cutoff: 560,
    sheetSize: "56 × 84",
    area: 0.4704,
    sheetWeightInGM: 37.632,
    reamWeightInKG: 18.816,
    isActive: true,
  },
];

export function getActiveGsms() {
  return mockGsms.filter((g) => g.isActive);
}
