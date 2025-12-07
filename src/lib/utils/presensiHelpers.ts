// src/lib/utils/presensiHelpers.ts
import { calculateDistance } from "@/lib/utils/helper";

/**
 * Parsing string jam "08:00:00" ke object Date hari ini
 */
export const parseTime = (timeStr: string): Date => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0, 0);
  return date;
};

/**
 * Cek status keterlambatan (Absen Masuk)
 */
export const getLateInfo = (scheduleTime: string | undefined, serverTime: Date) => {
  if (!scheduleTime) return null;

  const schedule = parseTime(scheduleTime);

  if (serverTime > schedule) {
    const diffMs = serverTime.getTime() - schedule.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;

    let text = `${diffMins} menit`;
    if (diffHrs > 0) text = `${diffHrs} jam ${remainingMins} menit`;

    return { isLate: true, text };
  }
  return null;
};

/**
 * Cek status pulang awal (Absen Pulang)
 */
export const getEarlyInfo = (scheduleTime: string | undefined, serverTime: Date) => {
  if (!scheduleTime) return null;

  const schedule = parseTime(scheduleTime);

  if (serverTime < schedule) {
    const diffMs = schedule.getTime() - serverTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;

    let text = `${diffMins} menit`;
    if (diffHrs > 0) text = `${diffHrs} jam ${remainingMins} menit`;

    return { isEarly: true, text };
  }
  return null;
};

/**
 * Helper Hitung Jarak & Validasi Radius
 */
export const getDistanceInfo = (
  userLat: number | null,
  userLong: number | null,
  kantor: { lat: string; long: string; radius_limit: number } | undefined,
) => {
  if (!userLat || !userLong || !kantor) {
    return { distance: null, inRadius: false };
  }

  const dist = calculateDistance(userLat, userLong, parseFloat(kantor.lat), parseFloat(kantor.long));

  return {
    distance: dist,
    inRadius: dist <= kantor.radius_limit,
  };
};
