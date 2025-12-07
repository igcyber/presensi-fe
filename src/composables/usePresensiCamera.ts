import { onUnmounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

export function usePresensiCamera() {
  const isCameraOpen = ref(false);
  const isMirrored = ref(true);
  const videoRef = ref<HTMLVideoElement | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const stream = ref<MediaStream | null>(null);
  const capturedImage = ref<string | null>(null);
  const capturedFile = ref<File | null>(null);

  // Watcher ini memastikan stream masuk ke video
  // segera setelah elemen <video> muncul di layar (Dialog terbuka)
  watch([videoRef, stream], ([newVideoEl, newStream]) => {
    if (newVideoEl && newStream) {
      newVideoEl.srcObject = newStream;
    }
  });

  const toggleMirror = () => {
    isMirrored.value = !isMirrored.value;
  };

  const startCamera = async () => {
    try {
      capturedImage.value = null;
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
      });
      isCameraOpen.value = true;
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengakses kamera. Pastikan izin diberikan.");
      isCameraOpen.value = false;
    }
  };

  const stopCamera = () => {
    if (stream.value) {
      stream.value.getTracks().forEach((t) => t.stop());
      stream.value = null;
    }
    isCameraOpen.value = false;
  };

  const takePhoto = (fileNamePrefix: string) => {
    if (videoRef.value && canvasRef.value) {
      const video = videoRef.value;
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Jika Mirror ON, kita balik context canvasnya sebelum drawImage
        if (isMirrored.value) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        } else {
          // Reset transformasi jika tidak mirror (jaga-jaga)
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        ctx.drawImage(video, 0, 0);

        // Kembalikan transformasi ke normal agar tidak berantakan jika dipanggil lagi
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Simpan hasil
        capturedImage.value = canvas.toDataURL("image/jpeg");

        canvas.toBlob(
          (blob) => {
            if (blob) {
              capturedFile.value = new File([blob], `${fileNamePrefix}_${Date.now()}.jpg`, { type: "image/jpeg" });
            }
          },
          "image/jpeg",
          0.8,
        );
      }
    }
  };

  const retakePhoto = () => {
    capturedImage.value = null;
    capturedFile.value = null;
  };

  onUnmounted(() => {
    stopCamera();
  });

  return {
    isCameraOpen,
    isMirrored,
    toggleMirror,
    videoRef,
    canvasRef,
    capturedImage,
    capturedFile,
    startCamera,
    stopCamera,
    takePhoto,
    retakePhoto,
  };
}
