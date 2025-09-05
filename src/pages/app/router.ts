import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardPage from "@/pages/dashboard/IndexPage.vue";

export default {
  path: "/app",
  component: AuthLayout,
  children: [
    {
      path: "",
      redirect: { name: "not-found" },
    },
    {
      path: "dashboard",
      name: "app.dashboard",
      component: DashboardPage,
    },
  ],
};
