import AuthLayout from "@/layouts/AuthLayout.vue";
import beritaRoute from "@/pages/app/berita/route";
import dashboardDataRoute from "@/pages/app/dashboard-data/route";
import dashboardRoute from "@/pages/app/dashboard/route";
import profileRoute from "@/pages/app/profile/route";

// import userRoute from "./user/route";
import userRoute from "./user/route";

export default {
  path: "/app",
  component: AuthLayout,
  children: [
    {
      path: "",
      redirect: { name: "not-found" },
    },
    ...dashboardRoute,
    ...dashboardDataRoute,
    ...profileRoute,
    ...userRoute,
    ...beritaRoute,
  ],
};
