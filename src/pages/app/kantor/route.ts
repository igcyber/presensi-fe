import KantorDetailPage from "./DetailPage.vue";
import KantorPage from "./IndexPage.vue";

export default [
  {
    path: "kantor",
    name: "app.kantor",
    component: KantorPage,
    meta: {
      requiresAuth: true,
      title: "Kantor",
    },
  },
  {
    path: "kantor/:id",
    name: "app.kantor.detail",
    component: KantorDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Kantor",
    },
  },
];
