import AuthLayout from "@/layouts/AuthLayout.vue";
import dashboardRoute from "@/pages/app/dashboard/route";
import hariLiburRoute from "@/pages/app/hari-libur/route";
import kantorRoute from "@/pages/app/kantor/route";
import profileRoute from "@/pages/app/profile/route";
import pwaVersionRoute from "@/pages/app/pwa-version/route";
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
    ...profileRoute,
    ...kantorRoute,
    ...tipePegawaiRoute,
    ...userRoute,
    ...hariLiburRoute,
    ...pwaVersionRoute,
    ...tagsRoute,
  ],
};
