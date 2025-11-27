import api from 'http/api';

export interface UserVM {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  password?: string;
}

export enum UserRole {
  CLIENTE = 'Cliente',
  FUNCIONARIO = 'Funcionario',
  GERENTE = 'Gerente',
}

export async function fetchUsers(): Promise<UserVM[]> {
  const response = await api.get<UserVM[]>('/users/');
  return response.data;
}

export async function fetchUserById(
  id: number | string,
): Promise<UserVM | null> {
  const response = await api.get<UserVM>(`/users/${id}`);
  return response.data || null;
}

export async function deleteUserById(id: number | string): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function createUser(user: {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
}): Promise<UserVM> {
  const response = await api.post<UserVM>('/users/', user);
  return response.data;
}

export async function updateUser(
  id: number | string,
  user: {
    nome?: string;
    email?: string;
    senha?: string;
    role?: UserRole;
  },
): Promise<UserVM> {
  const response = await api.put<UserVM>(`/users/${id}`, user);
  return response.data;
}
