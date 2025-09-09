import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListResponse,
  UserQueryParams,
} from "@/lib/api/types/user.types";

const base = "/api/users";

export const userService = createCrudService<User, User, CreateUserRequest, UpdateUserRequest>(base);

/**
 * Mendapatkan daftar user dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar user dengan pagination
 * @endpoint GET /api/users
 * @example
 * ```typescript
 * const response = await getUsers({ page: 1, per_page: 10, search: 'admin' });
 * console.log(response.data.data); // Array of users
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getUsers = (params?: UserQueryParams): Promise<ApiResponse<UserListResponse>> => userService.get(params);

/**
 * Mendapatkan user berdasarkan ID
 * @param id - ID user
 * @returns Promise yang mengembalikan data user
 * @endpoint GET /api/users/{id}
 * @example
 * ```typescript
 * const response = await getUserById(123);
 * console.log(response.data.fullName);
 * ```
 */
export const getUserById = (id: number): Promise<ApiResponse<User>> => userService.getById(id);

/**
 * Membuat user baru
 * @param payload - Data untuk membuat user baru
 * @returns Promise yang mengembalikan data user yang dibuat
 * @endpoint POST /api/users
 * @example
 * ```typescript
 * const response = await createUser({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   username: 'johndoe',
 *   nip: '123456789',
 *   password: 'password123',
 *   roleIds: [1, 2]
 * });
 * console.log(response.data.id);
 * ```
 */
export const createUser = (payload: CreateUserRequest) => userService.create(payload);

/**
 * Memperbarui data user
 * @param id - ID user yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data user yang diperbarui
 * @endpoint PUT /api/users/{id}
 * @example
 * ```typescript
 * const response = await updateUser(123, {
 *   fullName: 'John Doe Updated',
 *   email: 'john.updated@example.com'
 * });
 * console.log(response.data.fullName);
 * ```
 */
export const updateUser = (id: number, payload: UpdateUserRequest): Promise<ApiResponse<User>> =>
  userService.update(id, payload);

/**
 * Menghapus user
 * @param id - ID user yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/users/{id}
 * @example
 * ```typescript
 * await deleteUser(123);
 * console.log('User berhasil dihapus');
 * ```
 */
export const deleteUser = (id: number): Promise<ApiResponse<null>> => userService.remove(id);
