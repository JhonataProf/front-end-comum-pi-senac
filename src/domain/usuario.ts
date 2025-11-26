// src/interface/Usuario.ts
export type Role = 'GERENTE' | 'FUNCIONARIO' | 'CLIENTE';

export default interface Usuario {
  id: string;
  role: Role;
  email?: string;
}
