import AppLayout from "@/components/layout/AppLayout.vue";

import DokumenPage from "@/pages/media/dokumen/IndexPage.vue";
import FotoPage from "@/pages/media/foto/IndexPage.vue";
import InfografisPage from "@/pages/media/infografis/IndexPage.vue";
import MajalahPage from "@/pages/media/majalah/IndexPage.vue";
import RadioPage from "@/pages/media/radio/IndexPage.vue";
import VideoPage from "@/pages/media/video/IndexPage.vue";

export default {
  path: "/media",
  component: AppLayout,
  children: [
    {
      path: "foto",
      name: "media.foto",
      component: FotoPage,
      meta: {
        title: "Foto",
      },
    },
    {
      path: "video",
      name: "media.video",
      component: VideoPage,
      meta: {
        title: "Video",
      },
    },
    {
      path: "radio",
      name: "media.radio",
      component: RadioPage,
      meta: {
        title: "Radio",
      },
    },
    {
      path: "dokumen",
      name: "media.dokumen",
      component: DokumenPage,
      meta: {
        title: "Dokumen",
      },
    },
    {
      path: "infografis",
      name: "media.infografis",
      component: InfografisPage,
      meta: {
        title: "Infografis",
      },
    },
    {
      path: "majalah",
      name: "media.majalah",
      component: MajalahPage,
      meta: {
        title: "Majalah",
      },
    },
  ],
};
