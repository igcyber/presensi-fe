import PortalDetailPage from "./DetailPage.vue";
import PortalPage from "./IndexPage.vue";

export default [
  {
    path: "portal",
    name: "app.portal",
    component: PortalPage,
    meta: {
      requiresAuth: true,
      title: "Portal",
    },
  },
  {
    path: "portal/:id",
    name: "app.portal.detail",
    component: PortalDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Portal",
    },
  },
];
