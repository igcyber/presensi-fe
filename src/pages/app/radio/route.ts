import RadioDetailPage from "./DetailPage.vue";
import RadioPage from "./IndexPage.vue";

export default [
  {
    path: "radio",
    name: "app.radio",
    component: RadioPage,
    meta: {
      requiresAuth: true,
      title: "Radio",
    },
  },
  {
    path: "radio/:id",
    name: "app.radio.detail",
    component: RadioDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Radio",
    },
  },
];
