import DokumenDetailPage from "./DetailPage.vue";
import DokumenPage from "./IndexPage.vue";

export default [
  {
    path: "dokumen",
    name: "app.dokumen",
    component: DokumenPage,
    meta: {
      requiresAuth: true,
      title: "JDIH",
    },
  },
  {
    path: "dokumen/:id",
    name: "app.dokumen.detail",
    component: DokumenDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail JDIH",
    },
  },
];
