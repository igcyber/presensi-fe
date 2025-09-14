import UserDetailPage from "./DetailPage.vue";
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
  {
    path: "users/:id",
    name: "app.user.detail",
    component: UserDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail User",
    },
  },
];
