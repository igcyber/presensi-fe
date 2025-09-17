import MajalahDetailPage from "./DetailPage.vue";
import MajalahPage from "./IndexPage.vue";

export default [
  {
    path: "majalah",
    name: "app.majalah",
    component: MajalahPage,
    meta: {
      requiresAuth: true,
      title: "Majalah",
    },
  },
  {
    path: "majalah/:id",
    name: "app.majalah.detail",
    component: MajalahDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Majalah",
    },
  },
];
