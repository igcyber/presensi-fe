/**
 * Generate year options for prestasi filter
 */
export const generateYearOptions = (startYear: number = 2020) => {
  const currentYear = new Date().getFullYear();
  const years = [];

  // Generate years from current year down to start year
  for (let year = currentYear; year >= startYear; year--) {
    years.push({ label: year.toString(), value: year.toString() });
  }

  return years;
};

/**
 * Menghitung jarak antara dua koordinat dalam meter (Haversine Formula)
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Radius bumi dalam meter
  const toRad = (val: number) => (val * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Hasil dalam meter (dibulatkan)
};

/**
 * Generate year options for select input
 * @param range Number of years back
 */
export const getYearOptions = (range: number = 5) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < range; i++) {
    const year = currentYear - i;
    years.push({ label: String(year), value: year });
  }
  return years;
};

export const monthOptions = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];
