import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import AppLayout from "@/layouts/AppLayout.vue";
import DynamicPage from "@/pages/ppid/DynamicPage.vue";
import PpidPage from "@/pages/ppid/IndexPage.vue";

// kategori valid
const validCategories = [
  "informasi-berkala",
  "informasi-dikecualikan",
  "informasi-serta-merta",
  "informasi-setiap-saat",
];

// validate category
const validateCategory = (category: string) => {
  return validCategories.includes(category);
};

export default [
  {
    path: "/ppid",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "ppid.index",
        component: PpidPage,
        meta: {
          title: "PPID",
        },
      },
      {
        path: "kategori/:type",
        name: "ppid.kategori",
        component: DynamicPage,
        meta: {
          title: "PPID Kategori",
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          if (!validateCategory(to.params.type as string)) {
            next({ name: "not-found" });
          } else {
            next();
          }
        },
      },
    ],
  },
];
