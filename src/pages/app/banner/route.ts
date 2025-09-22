import BannerDetailPage from "./DetailPage.vue";
import BannerPage from "./IndexPage.vue";

export default [
  {
    path: "banner",
    name: "app.banner",
    component: BannerPage,
    meta: {
      requiresAuth: true,
      title: "Banner",
    },
  },
  {
    path: "banner/:id",
    name: "app.banner.detail",
    component: BannerDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Banner",
    },
  },
];
