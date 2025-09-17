import LayananDetailPage from "./DetailPage.vue";
import LayananPage from "./IndexPage.vue";

export default [
  {
    path: "layanan",
    name: "app.layanan",
    component: LayananPage,
    meta: {
      requiresAuth: true,
      title: "Layanan",
    },
  },
  {
    path: "layanan/:id",
    name: "app.layanan.detail",
    component: LayananDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Layanan",
    },
  },
];
