import { NextRequest } from 'next/server';

interface RateLimitOptions {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiter usando in-memory store
 * Em produção, considere usar Redis para persistência entre instâncias
 */
export class RateLimiter {
  private interval: number;
  private uniqueTokenPerInterval: number;

  constructor(options: RateLimitOptions) {
    this.interval = options.interval;
    this.uniqueTokenPerInterval = options.uniqueTokenPerInterval;
  }

  /**
   * Verifica se a requisição deve ser permitida
   * @param identifier - Identificador único (IP, user ID, etc)
   * @returns true se permitido, false se excedeu o limite
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // Se não existe ou expirou, criar nova entrada
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.interval;
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime,
      });

      return {
        allowed: true,
        remaining: this.uniqueTokenPerInterval - 1,
        resetTime,
      };
    }

    // Se já excedeu o limite
    if (entry.count >= this.uniqueTokenPerInterval) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
      allowed: true,
      remaining: this.uniqueTokenPerInterval - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Limpa entradas expiradas do store (garbage collection)
   */
  cleanup() {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }
}

// Configurações pré-definidas
export const rateLimiters = {
  // 100 requisições por minuto
  standard: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 100,
  }),
  // 20 requisições por minuto para operações sensíveis
  sensitive: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 20,
  }),
  // 5 requisições por minuto para autenticação
  auth: new RateLimiter({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5,
  }),
  // 10 requisições por hora para operações críticas
  critical: new RateLimiter({
    interval: 60 * 60 * 1000,
    uniqueTokenPerInterval: 10,
  }),
};

/**
 * Extrai identificador da requisição (IP ou user ID)
 */
export function getIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Tentar obter IP real (considerando proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Middleware helper para aplicar rate limiting
 */
export function applyRateLimit(
  request: NextRequest,
  limiter: RateLimiter,
  identifier?: string
): Response | null {
  const id = identifier || getIdentifier(request);
  const { allowed, remaining, resetTime } = limiter.check(id);

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Você excedeu o limite de requisições. Tente novamente mais tarde.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': limiter['uniqueTokenPerInterval'].toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    );
  }

  return null;
}

// Limpar entradas expiradas a cada 10 minutos
if (typeof window === 'undefined') {
  setInterval(() => {
    Object.values(rateLimiters).forEach(limiter => limiter.cleanup());
  }, 10 * 60 * 1000);
}
