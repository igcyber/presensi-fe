import AuthLayout from "@/layouts/AuthLayout.vue";
import aplikasiTerkaitRoute from "@/pages/app/aplikasi-terkait/route";
import bannerRoute from "@/pages/app/banner/route";
import beritaRoute from "@/pages/app/berita/route";
import bupatiRoute from "@/pages/app/bupati/route";
import dashboardDataRoute from "@/pages/app/dashboard-data/route";
import dashboardRoute from "@/pages/app/dashboard/route";
import dokumenRoute from "@/pages/app/dokumen/route";
import kontenRoute from "@/pages/app/konten/route";
import layananRoute from "@/pages/app/layanan/route";
import majalahRoute from "@/pages/app/majalah/route";
import opdRoute from "@/pages/app/opd/route";
import perusdaRoute from "@/pages/app/perusda/route";
import portalRoute from "@/pages/app/portal/route";
import prestasiRoute from "@/pages/app/prestasi/route";
import profileRoute from "@/pages/app/profile/route";
import radioRoute from "@/pages/app/radio/route";
import statikRoute from "@/pages/app/statik/route";
import surveiKepuasanRoute from "@/pages/app/survei-kepuasan/route";

import userRoute from "./user/route";
import videoRoute from "./video/route";

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
    ...videoRoute,
    ...majalahRoute,
    ...dokumenRoute,
    ...prestasiRoute,
    ...perusdaRoute,
    ...layananRoute,
    ...bupatiRoute,
    ...opdRoute,
    ...kontenRoute,
    ...statikRoute,
    ...radioRoute,
    ...portalRoute,
    ...bannerRoute,
    ...aplikasiTerkaitRoute,
    ...surveiKepuasanRoute,
  ],
};
