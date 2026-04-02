import { ValidationError } from '@/shared/errors/app-error';

/**
 * Validates deposit amount:
 * - Must be positive
 * - Maximum 2 decimal places
 */
export function validateDepositAmount(amount: number): void {
  if (!Number.isFinite(amount)) {
    throw new ValidationError('El monto debe ser un número válido');
  }

  if (amount <= 0) {
    throw new ValidationError('Monto inválido');
  }

  if (Number(amount.toFixed(2)) !== amount) {
    throw new ValidationError('El monto admite máximo 2 decimales');
  }
}
