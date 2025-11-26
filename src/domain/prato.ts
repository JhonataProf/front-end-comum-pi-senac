export interface Prato {
  id: number;
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  descricao_detalhada: string;
  imagem: string;
  valor: number;
}

export type PratoCreate = Omit<Prato, 'id'>;
export type PratoUpdate = Partial<PratoCreate> & Pick<Prato, 'id'>;
