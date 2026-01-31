import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// ============ SCHEMAS DE VALIDAÇÃO ============

// User
export const userCreateSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(100),
  role: z.enum(['TEEN', 'PROFESSOR', 'RESPONSIBLE', 'ADMIN']),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos').optional(),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido').optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,11}$/).optional(),
  avatar: z.string().url().optional(),
});

// Authentication
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// ISJF
export const isjfResponseSchema = z.object({
  questionId: z.string().cuid(),
  selectedOption: z.enum(['A', 'B']),
  responseTime: z.number().min(0).optional(),
});

export const isjfSubmitSchema = z.object({
  answers: z.array(isjfResponseSchema).min(1, 'Pelo menos uma resposta é necessária'),
  totalTime: z.number().min(0).optional(),
});

// Activity
export const activityProgressSchema = z.object({
  activityId: z.string().cuid(),
  completed: z.boolean(),
  timeSpent: z.number().min(0).optional(),
  score: z.number().min(0).max(100).optional(),
});

// Message
export const messageCreateSchema = z.object({
  receiverId: z.string().cuid(),
  content: z.string().min(1, 'Mensagem não pode estar vazia').max(5000),
  attachmentUrl: z.string().url().optional(),
});

// Teen
export const teenCreateSchema = z.object({
  userId: z.string().cuid(),
  institutionId: z.string().cuid().optional(),
  classId: z.string().cuid().optional(),
  schoolGrade: z.string().optional(),
  birthDate: z.string().datetime().optional(),
});

// Institution
export const institutionCreateSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['SCHOOL', 'NGO', 'COMPANY', 'OTHER']),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos').optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  phone: z.string().regex(/^\d{10,11}$/).optional(),
});

// Class
export const classCreateSchema = z.object({
  name: z.string().min(2).max(200),
  institutionId: z.string().cuid(),
  professorId: z.string().cuid(),
  schoolYear: z.number().min(2020).max(2100),
  description: z.string().max(1000).optional(),
});

// ============ FUNÇÕES DE SANITIZAÇÃO ============

/**
 * Sanitiza HTML para prevenir XSS
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

/**
 * Remove caracteres especiais perigosos
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"']/g, '') // Remove caracteres HTML perigosos
    .trim();
}

/**
 * Valida e sanitiza email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Valida CPF
 */
export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Helper para validar schema Zod e retornar erros formatados
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: 'Erro de validação' } };
  }
}
