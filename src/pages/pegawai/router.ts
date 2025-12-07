// src/pages/pegawai/router.ts (Modified)
import AuthLayout from "@/layouts/AuthLayout.vue";
import PengajuanTidakHadir from "@/pages/pegawai/PengajuanTidakHadir.vue";
import RekapPresensiPage from "@/pages/pegawai/RekapPresensiPage.vue";
import RiwayatPresensiPage from "@/pages/pegawai/RiwayatPresensiPage.vue";

import PresensiHarianPage from "./PresensiHarianPage.vue";

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
      component: PresensiHarianPage,
      meta: {
        title: "Presensi Harian",
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
      component: RiwayatPresensiPage,
      meta: {
        title: "Riwayat Presensi",
        roles: ["pegawai"],
      },
    },
    {
      path: "permohonan",
      name: "pegawai.permohonan",
      component: PengajuanTidakHadir,
      meta: {
        title: "Pengajuan Tidak Hadir",
        roles: ["pegawai"],
      },
    },
  ],
};
