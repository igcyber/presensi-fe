import KontenDetailPage from "./DetailPage.vue";
import KontenPage from "./IndexPage.vue";

export default [
  {
    path: "konten",
    name: "app.konten",
    component: KontenPage,
    meta: {
      requiresAuth: true,
      title: "Konten",
    },
  },
  {
    path: "konten/:id",
    name: "app.konten.detail",
    component: KontenDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Konten",
    },
  },
];
