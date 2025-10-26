import DokumenKategoriDetailPage from "./DetailPage.vue";
import DokumenKategoriPage from "./IndexPage.vue";

export default [
  {
    path: "dokumen-kategori",
    name: "app.dokumen-kategori",
    component: DokumenKategoriPage,
    meta: {
      requiresAuth: true,
      title: "Kategori JDIH",
    },
  },
  {
    path: "dokumen-kategori/:id",
    name: "app.dokumen-kategori.detail",
    component: DokumenKategoriDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Kategori JDIH",
    },
  },
];
