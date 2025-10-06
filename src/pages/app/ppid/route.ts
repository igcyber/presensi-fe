import PpidDetailPage from "./DetailPage.vue";
import PpidPage from "./IndexPage.vue";

export default [
  {
    path: "ppid",
    name: "app.ppid",
    component: PpidPage,
    meta: {
      requiresAuth: true,
      title: "PPID",
    },
  },
  {
    path: "ppid/:id/:type",
    name: "app.ppid.detail",
    component: PpidDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail PPID",
    },
  },
];
