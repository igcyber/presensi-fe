import FotoDetailPage from "./DetailPage.vue";
import FotoPage from "./IndexPage.vue";

export default [
  {
    path: "foto",
    name: "app.foto",
    component: FotoPage,
    meta: {
      requiresAuth: true,
      title: "Foto",
    },
  },
  {
    path: "foto/:id",
    name: "app.foto.detail",
    component: FotoDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Foto",
    },
  },
];
