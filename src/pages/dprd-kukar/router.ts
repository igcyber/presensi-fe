import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import AppLayout from "@/layouts/AppLayout.vue";
import DynamicMenuPage from "@/pages/dprd-kukar/DynamicPage.vue";
import StrukturOrganisasiPage from "@/pages/dprd-kukar/struktur-organisasi/IndexPage.vue";

const allowedSlugs = ["maklumat", "fungsi-sekretariat", "sop-pelayanan-publik", "sop-sekretariat-dprd"];

export default [
  {
    path: "/sekretariat-dprd-kukar",
    component: AppLayout,
    children: [
      {
        path: "struktur-organisasi",
        name: "dprd-kukar.struktur-organisasi",
        component: StrukturOrganisasiPage,
        meta: {
          title: "Struktur Organisasi",
        },
      },
      {
        path: ":slug",
        name: "dprd-kukar.dynamic",
        component: DynamicMenuPage,
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          if (!allowedSlugs.includes(to.params.slug as string)) {
            return next({ name: "not-found" });
          }
          next();
        },
        meta: {
          title: "DPRD Kukar",
        },
      },
    ],
  },
];
