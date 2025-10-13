import DashboarDatadPage from "@/pages/app/dashboard-data/IndexPage.vue";

export default [
  {
    path: "dashboard-data",
    name: "app.dashboard-data",
    component: DashboarDatadPage,
    meta: {
      requiresAuth: true,
      title: "Dashboard Data",
    },
  },
];
