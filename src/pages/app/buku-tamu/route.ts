import BukuTamuDetailPage from "./DetailPage.vue";
import BukuTamuPage from "./IndexPage.vue";

export default [
  {
    path: "buku-tamu",
    name: "app.buku-tamu",
    component: BukuTamuPage,
    meta: {
      requiresAuth: true,
      title: "Buku Tamu",
    },
  },
  {
    path: "buku-tamu/:id",
    name: "app.buku-tamu.detail",
    component: BukuTamuDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Buku Tamu",
    },
  },
];
