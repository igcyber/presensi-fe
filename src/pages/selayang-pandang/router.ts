import AppLayout from "@/components/layout/AppLayout.vue";

import KependudukanPage from "@/pages/selayang-pandang/kependudukan/IndexPage.vue";
import PotensiDaerahPage from "@/pages/selayang-pandang/potensi/IndexPage.vue";
import PrestasiPage from "@/pages/selayang-pandang/prestasi/IndexPage.vue";
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
        requiresAuth: true,
        title: "Sejarah",
      },
    },
    {
      path: "kependudukan",
      name: "selayang-pandang.kependudukan",
      component: KependudukanPage,
      meta: {
        requiresAuth: true,
        title: "Kependudukan",
      },
    },
    {
      path: "potensi-daerah",
      name: "selayang-pandang.potensi-daerah",
      component: PotensiDaerahPage,
      meta: {
        requiresAuth: true,
        title: "Potensi Daerah",
      },
    },
    {
      path: "prestasi-dan-penghargaan",
      name: "selayang-pandang.prestasi",
      component: PrestasiPage,
      meta: {
        requiresAuth: true,
        title: "Prestasi",
      },
    },
  ],
};
