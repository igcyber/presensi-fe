import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import AppLayout from "@/layouts/AppLayout.vue";
import DynamicPage from "@/pages/dokumen/DynamicPage.vue";
import IndexPage from "@/pages/dokumen/IndexPage.vue";

// validate kategori ID (harus number)
const validateKategoriId = (id: string) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0;
};

export default [
  {
    path: "/jdih",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "dokumen.index",
        component: IndexPage,
        meta: {
          title: "JDIH",
        },
      },
      {
        path: "kategori/:id",
        name: "dokumen.kategori",
        component: DynamicPage,
        meta: {
          title: "Kategori JDIH",
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          if (!validateKategoriId(to.params.id as string)) {
            next({ name: "not-found" });
          } else {
            next();
          }
        },
      },
    ],
  },
];
