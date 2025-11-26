export interface OrderBase {
  id: number;
  userId?: string;
  clienteTelefone?: string;
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
}

export type OrderCreate = Omit<OrderBase, 'id'>;
export type OrderUpdate = Partial<OrderCreate> & Pick<OrderBase, 'id'>;
