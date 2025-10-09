import InfografisDetailPage from "./DetailPage.vue";
import InfografisPage from "./IndexPage.vue";

export default [
  {
    path: "infografis",
    name: "app.infografis",
    component: InfografisPage,
    meta: {
      requiresAuth: true,
      title: "Infografis",
    },
  },
  {
    path: "infografis/:id",
    name: "app.infografis.detail",
    component: InfografisDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Infografis",
    },
  },
];
