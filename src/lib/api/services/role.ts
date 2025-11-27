import type { ApiResponse, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateRoleRequest,
  Role,
  RoleListResponse,
  RoleQueryParams,
  UpdateRoleRequest,
} from "@/lib/api/types/role.types";

const base = "/api/roles";

export const roleService = createCrudService<Role, Role, CreateRoleRequest, UpdateRoleRequest>(base);

/**
 * Mendapatkan daftar role dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar role dengan pagination
 * @endpoint GET /api/roles
 * @example
 * ```typescript
 * const response = await getRoles({ page: 1, perPage: 10, search: 'admin' });
 * console.log(response.data.data); // Array of roles
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getRoles = (params?: SearchParams | RoleQueryParams): Promise<ApiResponse<RoleListResponse>> => {
  // Convert SearchParams (limit) to RoleQueryParams (perPage)
  const queryParams: Record<string, any> = {};

  if (params) {
    queryParams.page = params.page;
    queryParams.search = params.search;

    // Convert limit to perPage for API
    if ("limit" in params && params.limit) {
      queryParams.perPage = params.limit;
    } else if ("perPage" in params && params.perPage) {
      queryParams.perPage = params.perPage;
    } else if ("per_page" in params && params.per_page) {
      queryParams.perPage = params.per_page;
    }

    // Handle sort
    if (params.sort) {
      const [field, order] = params.sort.split(":");
      queryParams.sort_by = field;
      queryParams.sort_order = order || "asc";
    }
  }

  return roleService.get(queryParams);
};

/**
 * Mendapatkan role berdasarkan ID
 * @param id - ID role
 * @returns Promise yang mengembalikan data role
 * @endpoint GET /api/roles/{id}
 * @example
 * ```typescript
 * const response = await getRoleById(123);
 * console.log(response.data.name);
 * ```
 */
export const getRoleById = (id: number): Promise<ApiResponse<Role>> => roleService.getById(id);

/**
 * Membuat role baru
 * @param payload - Data untuk membuat role baru
 * @returns Promise yang mengembalikan data role yang dibuat
 * @endpoint POST /api/roles
 * @example
 * ```typescript
 * const response = await createRole({
 *   name: 'Administrator',
 *   description: 'Role untuk administrator sistem',
 *   permissions: ['user.create', 'user.read', 'user.update', 'user.delete']
 * });
 * console.log(response.data.id);
 * ```
 */
export const createRole = (payload: CreateRoleRequest) => roleService.create(payload);

/**
 * Memperbarui data role
 * @param id - ID role yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data role yang diperbarui
 * @endpoint PUT /api/roles/{id}
 * @example
 * ```typescript
 * const response = await updateRole(123, {
 *   name: 'Super Administrator',
 *   description: 'Role untuk super administrator sistem'
 * });
 * console.log(response.data.name);
 * ```
 */
export const updateRole = (id: number, payload: UpdateRoleRequest): Promise<ApiResponse<Role>> =>
  roleService.update(id, payload);

/**
 * Menghapus role
 * @param id - ID role yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/roles/{id}
 * @example
 * ```typescript
 * await deleteRole(123);
 * console.log('Role berhasil dihapus');
 * ```
 */
export const deleteRole = (id: number): Promise<ApiResponse<null>> => roleService.remove(id);
