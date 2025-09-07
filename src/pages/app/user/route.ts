import UserPage from "./IndexPage.vue";

export default [
  {
    path: "user",
    name: "app.user",
    component: UserPage,
    meta: {
      requiresAuth: true,
      title: "User",
    },
  },
];
