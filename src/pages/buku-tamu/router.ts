import IndexPage from "./IndexPage.vue";

export default [
  {
    path: "/buku-tamu/:id/:slug",
    name: "buku-tamu.fill",
    component: IndexPage,
    meta: {
      title: "Isi Buku Tamu",
      requiresAuth: false,
    },
  },
];
