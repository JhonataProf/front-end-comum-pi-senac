// src/utils/auth.ts
import { Role } from 'domain/usuario';

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: Role | string;
  exp?: number;
  [key: string]: unknown;
}

export interface ParsedToken {
  payload: JwtPayload;
  isExpired: boolean;
}

export function parseJwtPayload(token: string): ParsedToken | null {
  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return null;

    const json = atob(payloadBase64);
    const payload = JSON.parse(json) as JwtPayload;

    const now = Date.now();
    const expMs = payload.exp ? payload.exp * 1000 : null;
    const isExpired = expMs !== null ? expMs < now : false;

    return { payload, isExpired };
  } catch (error) {
    console.error('Erro ao decodificar JWT', error);
    return null;
  }
}
