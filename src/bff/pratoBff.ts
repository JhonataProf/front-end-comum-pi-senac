// src/bff/pratoBff.ts
import { Prato } from 'domain/prato';
import api from 'http/api';

export interface PratoClienteVM {
  id: number;
  nome: string;
  cozinha: string;
  descricaoCurta: string;
  descricaoDetalhada: string;
  imagemUrl: string;
  valor: number;
  precoFormatado: string;
}

function mapPratoToClienteVM(prato: Prato): PratoClienteVM {
  return {
    id: prato.id,
    nome: prato.nome,
    cozinha: prato.cozinha,
    descricaoCurta: prato.descricao_resumida,
    descricaoDetalhada: prato.descricao_detalhada,
    imagemUrl: prato.imagem,
    valor: prato.valor,
    precoFormatado: prato.valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }),
  };
}

export async function fetchPratosCliente(): Promise<PratoClienteVM[]> {
  const resp = await api.get<Prato[]>('/pratos');
  const data = resp.data ?? [];
  return data.map(mapPratoToClienteVM);
}

export async function fetchPratoClienteById(
  id: string | number,
): Promise<PratoClienteVM | null> {
  const resp = await api.get<Prato>(`/pratos/${id}`);
  if (!resp.data) return null;
  return mapPratoToClienteVM(resp.data);
}
