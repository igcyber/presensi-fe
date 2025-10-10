import RapatDetailPage from "./DetailPage.vue";
import RapatPage from "./IndexPage.vue";

export default [
  {
    path: "rapat",
    name: "app.rapat",
    component: RapatPage,
    meta: {
      requiresAuth: true,
      title: "Rapat",
    },
  },
  {
    path: "rapat/:id",
    name: "app.rapat.detail",
    component: RapatDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Rapat",
    },
  },
];
