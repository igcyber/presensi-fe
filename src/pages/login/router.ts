import IndexPage from "./IndexPage.vue";

export default [
  {
    path: "/login",
    name: "login.index",
    component: IndexPage,
    meta: {
      requiresAuth: false,
      title: "Login",
    },
  },
];
