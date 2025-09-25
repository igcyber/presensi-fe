import AplikasiTerkaitDetailPage from "./DetailPage.vue";
import AplikasiTerkaitPage from "./IndexPage.vue";

export default [
  {
    path: "aplikasi-terkait",
    name: "app.aplikasi-terkait",
    component: AplikasiTerkaitPage,
    meta: {
      requiresAuth: true,
      title: "Aplikasi Terkait",
    },
  },
  {
    path: "aplikasi-terkait/:id",
    name: "app.aplikasi-terkait.detail",
    component: AplikasiTerkaitDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Aplikasi Terkait",
    },
  },
];
