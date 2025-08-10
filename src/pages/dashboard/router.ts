import AppLayout from "@/components/layout/AppLayout.vue";

import DashboardPage from "@/pages/dashboard/IndexPage.vue";

export default {
  path: "/dashboard",
  component: AppLayout,
  children: [
    {
      path: "",
      name: "dashboard.index",
      component: DashboardPage,
      meta: {
        requiresAuth: true,
        title: "Dashboard",
      },
    },
  ],
};
