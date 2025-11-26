import JenisUsahaDetailPage from "./DetailPage.vue";
import JenisUsahaPage from "./IndexPage.vue";

export default [
  {
    path: "jenis-usaha",
    name: "app.jenis-usaha",
    component: JenisUsahaPage,
    meta: {
      requiresAuth: true,
      title: "Jenis Usaha",
    },
  },
  {
    path: "jenis-usaha/:id",
    name: "app.jenis-usaha.detail",
    component: JenisUsahaDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Jenis Usaha",
    },
  },
];
