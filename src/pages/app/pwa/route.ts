import HariLiburDetailPage from "./DetailPage.vue";
import HariLiburPage from "./IndexPage.vue";

export default [
  {
    path: "hari-libur",
    name: "app.hari-libur",
    component: HariLiburPage,
    meta: {
      requiresAuth: true,
      title: "Hari Libur",
    },
  },
  {
    path: "hari-libur/:id",
    name: "app.hari-libur.detail",
    component: HariLiburDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Hari Libur",
    },
  },
];
