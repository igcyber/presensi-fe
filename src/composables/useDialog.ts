import { ref } from "vue";

export interface DialogState<T = any> {
  open: boolean;
  mode: "create" | "edit" | "view";
  data: T | null;
  loading: boolean;
}

export function useDialog<T = any>(initialState?: Partial<DialogState<T>>) {
  const state = ref<DialogState<T>>({
    open: false,
    mode: "create",
    data: null,
    loading: false,
    ...initialState,
  });

  const openDialog = (mode: "create" | "edit" | "view" = "create", data: T | null = null) => {
    state.value.mode = mode;
    state.value.data = data as any;
    state.value.open = true;
  };

  const closeDialog = () => {
    state.value.open = false;
    state.value.data = null;
    state.value.loading = false;
  };

  const openCreate = () => openDialog("create");

  const openEdit = (data: T) => openDialog("edit", data);

  const openView = (data: T) => openDialog("view", data);

  const setLoading = (loading: boolean) => {
    state.value.loading = loading;
  };

  return {
    state,
    openDialog,
    closeDialog,
    openCreate,
    openEdit,
    openView,
    setLoading,
  };
}

// Confirm dialog specific composable
export function useConfirmDialog() {
  const open = ref(false);
  const loading = ref(false);
  const data = ref<any>(null);

  const showConfirm = (item?: any) => {
    data.value = item;
    open.value = true;
  };

  const hideConfirm = () => {
    open.value = false;
    data.value = null;
    loading.value = false;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return {
    open,
    loading,
    data,
    showConfirm,
    hideConfirm,
    setLoading,
  };
}
