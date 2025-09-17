import OpdDetailPage from "./DetailPage.vue";
import OpdPage from "./IndexPage.vue";

export default [
  {
    path: "opd",
    name: "app.opd",
    component: OpdPage,
    meta: {
      requiresAuth: true,
      title: "OPD",
    },
  },
  {
    path: "opd/:id",
    name: "app.opd.detail",
    component: OpdDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail OPD",
    },
  },
];
