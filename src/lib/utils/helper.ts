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
