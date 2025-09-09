import UserPage from "./IndexPage.vue";

export default [
  {
    path: "users",
    name: "app.user",
    component: UserPage,
    meta: {
      requiresAuth: true,
      title: "User",
    },
  },
];
