import PageDetailPage from "./DetailPage.vue";
import PagesPage from "./IndexPage.vue";

export default [
  {
    path: "pages",
    name: "app.pages",
    component: PagesPage,
    meta: {
      requiresAuth: true,
      title: "Pages",
    },
  },
  {
    path: "pages/:id",
    name: "app.pages.detail",
    component: PageDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Page",
    },
  },
];
