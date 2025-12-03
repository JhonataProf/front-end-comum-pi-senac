// src/http/api.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_TOKEN_KEY = 'token';
const AUTH_REFRESH_TOKEN_KEY = 'refreshToken';
const AUTH_LOGIN_PATH = '/login'; // fallback genérico

// flag pra ligar/desligar logs facilmente
const isApiDebug = process.env.NODE_ENV === 'development';

// Interceptador de requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (isApiDebug) {
      console.log('[API][request]', {
        method: config.method,
        url: config.url,
        hasAuthHeader: !!token,
      });
    }

    return config;
  },
  (error) => {
    if (isApiDebug) {
      console.error('[API][request][error]', error);
    }
    return Promise.reject(error);
  },
);

// Helper para refresh usando axios “cru”
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    if (isApiDebug) {
      console.warn('[API][refresh] Nenhum refreshToken no localStorage.');
    }
    return null;
  }

  try {
    if (isApiDebug) {
      console.log('[API][refresh] Tentando renovar token...');
    }

    const response = await axios.post<{ token: string }>(
      `${API_BASE_URL}/refresh-token`,
      {
        // 👇 ajuste aqui se o backend espera outro nome (ex: token)
        refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const newToken = response.data.token;

    if (isApiDebug) {
      console.log('[API][refresh] Resposta do refresh-token', {
        status: response.status,
        hasToken: !!newToken,
      });
    }

    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      return newToken;
    }

    return null;
  } catch (error) {
    if (isApiDebug) {
      const axiosErr = error as AxiosError<ApiErrorResponse>;
      console.error('[API][refresh][error]', {
        message: axiosErr.message,
        status: axiosErr.response?.status,
        data: axiosErr.response?.data,
      });
    }
    return null;
  }
}

// Interceptador de resposta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (isApiDebug) {
      console.log('[API][response]', {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    if (isApiDebug) {
      console.groupCollapsed('[API][response][error]');
      console.log('URL:', originalRequest?.url);
      console.log('Status:', status);
      console.log('Método:', originalRequest?.method);
      console.log('Data erro:', error.response?.data);
    }

    // 401 → tenta refresh (se ainda não tentou)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isApiDebug) {
        console.log('[API][response][401]', 'Tentando fluxo de refresh...');
      }

      const newToken = await refreshAccessToken();

      if (newToken) {
        if (isApiDebug) {
          console.log(
            '[API][response][401]',
            'Refresh OK, refazendo request...',
            {
              url: originalRequest.url,
            },
          );
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        const retryResponse = await api(originalRequest);

        if (isApiDebug) {
          console.log(
            '[API][response][401]',
            'Request reexecutado com sucesso.',
            {
              url: originalRequest.url,
              status: retryResponse.status,
            },
          );
          console.groupEnd();
        }

        return retryResponse;
      }

      if (isApiDebug) {
        console.warn(
          '[API][response][401]',
          'Refresh falhou, limpando storage e redirecionando para login.',
        );
      }

      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);

      console.groupEnd();
      window.location.href = AUTH_LOGIN_PATH;
      return Promise.reject(error);
    }

    // 403 → acesso negado
    if (status === 403) {
      if (isApiDebug) {
        console.warn('[API][response][403] Acesso negado.', {
          url: originalRequest.url,
        });
        console.groupEnd();
      }

      alert('Você não possui acesso a esta tela.');
      window.history.back();

      return Promise.reject(
        new Error(
          JSON.stringify({
            status,
            message: error.response?.data?.message || 'Acesso negado.',
          }),
        ),
      );
    }

    // Outros erros >= 400
    if (status && status >= 400) {
      if (isApiDebug) {
        console.warn('[API][response][error >=400]', {
          status,
          url: originalRequest.url,
          data: error.response?.data,
        });
        console.groupEnd();
      }

      return Promise.reject(
        new Error(
          JSON.stringify({
            status,
            message: error.response?.data?.message || 'Erro desconhecido.',
          }),
        ),
      );
    }

    // Erros sem resposta (network, CORS, etc.)
    if (isApiDebug) {
      console.error('[API][response][network-error]', {
        message: error.message,
      });
      console.groupEnd();
    }

    return Promise.reject(
      new Error(
        JSON.stringify({
          status: 0,
          message: 'Erro de conexão.',
        }),
      ),
    );
  },
);

export default api;
