import MenuDetailPage from "./DetailPage.vue";
import MenuPage from "./IndexPage.vue";

export default [
  {
    path: "menu",
    name: "app.menu",
    component: MenuPage,
    meta: {
      requiresAuth: true,
      title: "Menu",
    },
  },
  {
    path: "menu/:id",
    name: "app.menu.detail",
    component: MenuDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Menu",
    },
  },
];
