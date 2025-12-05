// src/pages/pegawai/router.ts (Modified)
import AuthLayout from "@/layouts/AuthLayout.vue";
import AbsensiHarianPage from "@/pages/pegawai/AbsensiHarianPage.vue";
import RekapPresensiPage from "@/pages/pegawai/RekapPresensiPage.vue";
// New
import RiwayatAbsenPage from "@/pages/pegawai/RiwayatPresensiPage.vue";

// New

export default {
  path: "/pegawai",
  component: AuthLayout,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "absensi",
      name: "pegawai.absensi-harian",
      component: AbsensiHarianPage,
      meta: {
        title: "Absensi Harian",
        roles: ["pegawai"],
      },
    },
    {
      path: "rekap",
      name: "pegawai.rekap-presensi", // Sesuai permintaan: Rekap Presensi
      component: RekapPresensiPage,
      meta: {
        title: "Rekap Presensi",
        roles: ["pegawai"],
      },
    },
    {
      path: "riwayat",
      name: "pegawai.riwayat-absen", // Sesuai permintaan: Riwayat Absen
      component: RiwayatAbsenPage,
      meta: {
        title: "Riwayat Absen",
        roles: ["pegawai"],
      },
    },
    {
      path: "permohonan",
      name: "pegawai.permohonan",
      component: AbsensiHarianPage, // Placeholder, ganti nanti
      meta: {
        title: "Pengajuan Tidak Hadir",
        roles: ["pegawai"],
      },
    },
  ],
};
