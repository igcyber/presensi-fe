import BannerDetailPage from "./DetailPage.vue";
import BannerPage from "./IndexPage.vue";

export default [
  {
    path: "infografis",
    name: "app.infografis",
    component: BannerPage,
    meta: {
      requiresAuth: true,
      title: "Infografis",
    },
  },
  {
    path: "infografis/:id",
    name: "app.infografis.detail",
    component: BannerDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Infografis",
    },
  },
];
