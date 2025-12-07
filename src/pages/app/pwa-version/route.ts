import PwaVersionPage from "./IndexPage.vue";

export default [
  {
    path: "pwa-version",
    name: "app.pwa-version",
    component: PwaVersionPage,
    meta: {
      requiresAuth: true,
      title: "PWA Version",
    },
  },
];
