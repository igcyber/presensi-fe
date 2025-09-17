import PrestasiDetailPage from "./DetailPage.vue";
import PrestasiPage from "./IndexPage.vue";

export default [
  {
    path: "prestasi",
    name: "app.prestasi",
    component: PrestasiPage,
    meta: {
      requiresAuth: true,
      title: "Prestasi",
    },
  },
  {
    path: "prestasi/:id",
    name: "app.prestasi.detail",
    component: PrestasiDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Prestasi",
    },
  },
];
