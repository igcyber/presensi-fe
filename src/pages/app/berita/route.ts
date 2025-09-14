import BeritaDetailPage from "./DetailPage.vue";
import BeritaPage from "./IndexPage.vue";

export default [
  {
    path: "berita",
    name: "app.berita",
    component: BeritaPage,
    meta: {
      requiresAuth: true,
      title: "Berita",
    },
  },
  {
    path: "berita/:id",
    name: "app.berita.detail",
    component: BeritaDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Berita",
    },
  },
];
