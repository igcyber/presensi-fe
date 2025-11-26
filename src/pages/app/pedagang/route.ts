import PedagangDetailPage from "./DetailPage.vue";
import PedagangPage from "./IndexPage.vue";

export default [
  {
    path: "pedagangs",
    name: "app.pedagang",
    component: PedagangPage,
    meta: {
      requiresAuth: true,
      title: "Pedagang",
    },
  },
  {
    path: "pedagangs/:id",
    name: "app.pedagang.detail",
    component: PedagangDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Pedagang",
    },
  },
];
