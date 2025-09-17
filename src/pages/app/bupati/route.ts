import BupatiDetailPage from "./DetailPage.vue";
import BupatiPage from "./IndexPage.vue";

export default [
  {
    path: "bupati",
    name: "app.bupati",
    component: BupatiPage,
    meta: {
      requiresAuth: true,
      title: "Bupati",
    },
  },
  {
    path: "bupati/:id",
    name: "app.bupati.detail",
    component: BupatiDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Bupati",
    },
  },
];
