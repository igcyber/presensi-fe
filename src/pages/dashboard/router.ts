import IndexPage from "./IndexPage.vue";

export default {
  children: [
    {
      path: "/dashboard",
      name: "dashboard.index",
      component: IndexPage,
      meta: {
        requiresAuth: true,
        title: "Dashboard",
      },
    },
  ],
};
