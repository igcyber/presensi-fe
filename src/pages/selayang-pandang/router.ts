import AppLayout from "@/components/layout/AppLayout.vue";

import KependudukanPage from "@/pages/selayang-pandang/kependudukan/IndexPage.vue";
import PotensiDaerahPage from "@/pages/selayang-pandang/potensi-daerah/IndexPage.vue";
import PrestasiPage from "@/pages/selayang-pandang/prestasi-penghargaan/IndexPage.vue";
import SejarahPage from "@/pages/selayang-pandang/sejarah/IndexPage.vue";

export default {
  path: "/selayang-pandang",
  component: AppLayout,
  children: [
    {
      path: "sejarah",
      name: "selayang-pandang.sejarah",
      component: SejarahPage,
      meta: {
        title: "Sejarah",
        breadcrumb: "Sejarah",
      },
    },
    {
      path: "kependudukan",
      name: "selayang-pandang.kependudukan",
      component: KependudukanPage,
      meta: {
        title: "Kependudukan",
        breadcrumb: "Kependudukan",
      },
    },
    {
      path: "potensi-daerah",
      name: "selayang-pandang.potensi-daerah",
      component: PotensiDaerahPage,
      meta: {
        title: "Potensi Daerah",
        breadcrumb: "Potensi Daerah",
      },
    },
    {
      path: "prestasi-dan-penghargaan",
      name: "selayang-pandang.prestasi",
      component: PrestasiPage,
      meta: {
        title: "Prestasi",
        breadcrumb: "Prestasi dan Penghargaan",
      },
    },
  ],
};
