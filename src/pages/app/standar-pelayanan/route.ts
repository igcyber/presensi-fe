import DetailPage from "@/pages/app/standar-pelayanan/DetailPage.vue";
import IndexPage from "@/pages/app/standar-pelayanan/IndexPage.vue";

export default [
  {
    path: "standar-pelayanan",
    name: "app.standar-pelayanan",
    component: IndexPage,
    meta: {
      requiresAuth: true,
      title: "Standar Pelayanan",
    },
  },
  {
    path: "standar-pelayanan/:id",
    name: "app.standar-pelayanan.detail",
    component: DetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Standar Pelayanan",
    },
  },
];
