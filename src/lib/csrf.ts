import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * CSRF Protection
 * Gera e valida tokens CSRF para proteger contra Cross-Site Request Forgery
 */

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Gera um token CSRF aleatório
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Valida o token CSRF da requisição
 */
export function validateCsrfToken(request: NextRequest): boolean {
  // Métodos seguros não precisam de validação CSRF
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  // Obter token do header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  // Obter token do cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // Validar tokens
  if (!headerToken || !cookieToken) {
    return false;
  }

  return headerToken === cookieToken;
}

/**
 * Cria resposta com token CSRF no cookie
 */
export function setCsrfCookie(response: Response, token: string): Response {
  const headers = new Headers(response.headers);
  
  headers.append(
    'Set-Cookie',
    `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Middleware helper para verificar CSRF
 */
export function checkCsrf(request: NextRequest): Response | null {
  if (!validateCsrfToken(request)) {
    return new Response(
      JSON.stringify({
        error: 'CSRF token inválido ou ausente',
        message: 'Requisição bloqueada por segurança',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return null;
}

/**
 * Verifica se a origem da requisição é confiável
 */
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (!origin && !referer) {
    // Permitir requisições sem origin (ex: Postman, curl)
    // Em produção, considere bloquear
    return true;
  }

  const requestOrigin = origin || new URL(referer!).origin;
  
  return allowedOrigins.some(allowed => {
    if (allowed === '*') return true;
    if (allowed.endsWith('*')) {
      const base = allowed.slice(0, -1);
      return requestOrigin.startsWith(base);
    }
    return requestOrigin === allowed;
  });
}
