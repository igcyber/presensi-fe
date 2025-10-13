import TagDetailPage from "./DetailPage.vue";
import TagsPage from "./IndexPage.vue";

export default [
  {
    path: "tags",
    name: "app.tags",
    component: TagsPage,
    meta: {
      requiresAuth: true,
      title: "Tags",
    },
  },
  {
    path: "tags/:id",
    name: "app.tags.detail",
    component: TagDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Tag",
    },
  },
];
