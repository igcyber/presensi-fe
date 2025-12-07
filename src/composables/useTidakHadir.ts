import { computed, ref } from "vue";
import { toast } from "vue-sonner";

import { getPermohonanAdminList, verifyPermohonan } from "@/lib/api/services/presensi";
import type {
  PermohonanAdminItem,
  PermohonanAdminListResponse,
  PermohonanAdminParams,
  VerifyPermohonanPayload,
} from "@/lib/api/types/presensi.types";

export type TidakHadir = PermohonanAdminItem;

export function useTidakHadir() {
  const loading = ref(false);
  const verifying = ref(false);
  const tidakHadirList = ref<TidakHadir[]>([]);
  const pagination = ref({
    total: 0,
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
    firstPage: 1,
    firstPageUrl: "",
    lastPageUrl: "",
    nextPageUrl: null as string | null,
    previousPageUrl: null as string | null,
  });

  const filters = ref<PermohonanAdminParams>({
    search: null,
    status: "Semua Status",
    tipe: "Semua Tipe",
    date: new Date().toISOString().split("T")[0],
    page: 1,
    per_page: 10,
  });

  const tipeOptions = [
    { value: "Semua Tipe", label: "Semua Tipe" },
    { value: "Izin", label: "Izin" },
    { value: "Sakit", label: "Sakit" },
    { value: "Cuti", label: "Cuti" },
  ];

  const statusOptions = [
    { value: "Semua Status", label: "Semua Status" },
    { value: "pending", label: "Pending" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "batal", label: "Batal" },
  ];

  const loadTidakHadirAdmin = async () => {
    loading.value = true;
    try {
      const params: PermohonanAdminParams = {
        search: filters.value.search || undefined,
        status:
          filters.value.status === "Semua Status" ? undefined : filters.value.status.toLowerCase(),
        tipe: filters.value.tipe === "Semua Tipe" ? undefined : filters.value.tipe,
        date: filters.value.date,
        page: filters.value.page,
        per_page: filters.value.per_page,
      };

      const response = await getPermohonanAdminList(params);
      tidakHadirList.value = response.data.data;
      pagination.value = {
        total: response.data.meta.total,
        perPage: response.data.meta.perPage,
        currentPage: response.data.meta.currentPage,
        lastPage: response.data.meta.lastPage,
        firstPage: response.data.meta.firstPage,
        firstPageUrl: response.data.meta.firstPageUrl,
        lastPageUrl: response.data.meta.lastPageUrl,
        nextPageUrl: response.data.meta.nextPageUrl,
        previousPageUrl: response.data.meta.previousPageUrl,
      };
    } catch (error: any) {
      console.error("Error loading permohonan:", error);
      toast.error(error?.response?.data?.message || "Gagal memuat data permohonan");
    } finally {
      loading.value = false;
    }
  };

  const verifyPengajuan = async (id: number, status: "diterima" | "ditolak", keterangan?: string) => {
    verifying.value = true;
    try {
      const payload: VerifyPermohonanPayload = {
        status,
        keterangan_verifikator: keterangan,
      };

      await verifyPermohonan(id, payload);
      toast.success(`Permohonan berhasil ${status === "diterima" ? "diterima" : "ditolak"}`);
      return true;
    } catch (error: any) {
      console.error("Error verifying permohonan:", error);
      toast.error(error?.response?.data?.message || "Gagal memverifikasi permohonan");
      return false;
    } finally {
      verifying.value = false;
    }
  };

  const setPage = (page: number) => {
    filters.value.page = page;
  };

  const setSearch = (search: string) => {
    filters.value.search = search || null;
    filters.value.page = 1;
  };

  const setStatusFilter = (status: string) => {
    filters.value.status = status;
    filters.value.page = 1;
  };

  const setTipeFilter = (tipe: string) => {
    filters.value.tipe = tipe;
    filters.value.page = 1;
  };

  const setDateFilter = (date: string) => {
    filters.value.date = date;
    filters.value.page = 1;
  };

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "Izin":
        return "bg-blue-100 text-blue-800";
      case "Sakit":
        return "bg-red-100 text-red-800";
      case "Cuti":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "diterima":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      case "batal":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    loading,
    verifying,
    tidakHadirList,
    pagination,
    tipeOptions,
    statusOptions,
    filters,
    loadTidakHadirAdmin,
    verifyPengajuan,
    setPage,
    setSearch,
    setStatusFilter,
    setTipeFilter,
    setDateFilter,
    getTipeColor,
    getStatusColor,
    formatDate,
    formatDateTime,
  };
}
