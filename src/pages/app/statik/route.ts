import StatikDetailPage from "./DetailPage.vue";
import StatikPage from "./IndexPage.vue";

export default [
  {
    path: "statik",
    name: "app.statik",
    component: StatikPage,
    meta: {
      requiresAuth: true,
      title: "Statik",
    },
  },
  {
    path: "statik/:id",
    name: "app.statik.detail",
    component: StatikDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Statik",
    },
  },
];
