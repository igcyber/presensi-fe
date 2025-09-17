import PerusdaDetailPage from "./DetailPage.vue";
import PerusdaPage from "./IndexPage.vue";

export default [
  {
    path: "perusda",
    name: "app.perusda",
    component: PerusdaPage,
    meta: {
      requiresAuth: true,
      title: "Perusda",
    },
  },
  {
    path: "perusda/:id",
    name: "app.perusda.detail",
    component: PerusdaDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Perusda",
    },
  },
];
