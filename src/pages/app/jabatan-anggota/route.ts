import JabatanAnggotaDetailPage from "./DetailPage.vue";
import JabatanAnggotaPage from "./IndexPage.vue";

export default [
  {
    path: "jabatan-anggota",
    name: "app.jabatan-anggota",
    component: JabatanAnggotaPage,
    meta: {
      requiresAuth: true,
      title: "Jabatan Anggota",
    },
  },
  {
    path: "jabatan-anggota/:id",
    name: "app.jabatan-anggota.detail",
    component: JabatanAnggotaDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Jabatan Anggota",
    },
  },
];
