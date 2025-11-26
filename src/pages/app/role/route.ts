import RoleDetailPage from "./DetailPage.vue";
import RolePage from "./IndexPage.vue";

export default [
  {
    path: "roles",
    name: "app.role",
    component: RolePage,
    meta: {
      requiresAuth: true,
      title: "Role",
    },
  },
  {
    path: "roles/:id",
    name: "app.role.detail",
    component: RoleDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Role",
    },
  },
];
