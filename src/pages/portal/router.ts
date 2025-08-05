import IndexPage from "./IndexPage.vue";

export default {
  children: [
    {
      path: "/",
      name: "portal.index",
      component: IndexPage,
      meta: {
        title: "Portal",
      },
    },
  ],
};
