import VideoDetailPage from "./DetailPage.vue";
import VideoPage from "./IndexPage.vue";

export default [
  {
    path: "video",
    name: "app.video",
    component: VideoPage,
    meta: {
      requiresAuth: true,
      title: "Video",
    },
  },
  {
    path: "video/:id",
    name: "app.video.detail",
    component: VideoDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Video",
    },
  },
];
