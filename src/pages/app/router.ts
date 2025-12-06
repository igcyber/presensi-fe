import AuthLayout from "@/layouts/AuthLayout.vue";
import dashboardDataRoute from "@/pages/app/dashboard-data/route";
import dashboardRoute from "@/pages/app/dashboard/route";
import kantorRoute from "@/pages/app/kantor/route";
import profileRoute from "@/pages/app/profile/route";
import tagsRoute from "@/pages/app/tags/route";
import tipePegawaiRoute from "@/pages/app/tipe-pegawai/route";
import userRoute from "@/pages/app/user/route";

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
    ...kantorRoute,
    ...tipePegawaiRoute,
    ...userRoute,
    ...tagsRoute,
  ],
};
