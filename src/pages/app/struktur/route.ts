import StrukturDetailPage from "./DetailPage.vue";
import StrukturPage from "./IndexPage.vue";

export default [
  {
    path: "struktur",
    name: "app.struktur",
    component: StrukturPage,
    meta: {
      requiresAuth: true,
      title: "Struktur",
    },
  },
  {
    path: "struktur/:id",
    name: "app.struktur.detail",
    component: StrukturDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Struktur",
    },
  },
];
