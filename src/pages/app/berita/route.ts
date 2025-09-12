import BeritaPage from "./IndexPage.vue";

export default [
  {
    path: "berita",
    name: "app.berita",
    component: BeritaPage,
    meta: {
      requiresAuth: true,
      title: "Berita",
    },
  },
];
