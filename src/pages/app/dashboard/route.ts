import DashboardPage from "@/pages/app/dashboard/IndexPage.vue";

export default [
  {
    path: "dashboard",
    name: "app.dashboard",
    component: DashboardPage,
    meta: {
      requiresAuth: true,
      title: "Dashboard",
    },
  },
];
