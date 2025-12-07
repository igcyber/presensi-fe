import KantorPage from "./IndexPage.vue";

export default [
  {
    path: "kantor",
    name: "app.kantor",
    component: KantorPage,
    meta: {
      requiresAuth: true,
      title: "Kantor",
    },
  },
];
