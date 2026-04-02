import { ValidationError } from '@/shared/errors/app-error';

/**
 * Validates betting stake rules:
 * - Minimum: 1
 * - Maximum: 500
 * - Maximum 2 decimal places
 */
export function validateStake(stake: number): void {
  if (!Number.isFinite(stake)) {
    throw new ValidationError('El stake debe ser un número válido');
  }

  if (stake < 1) {
    throw new ValidationError('El stake mínimo es S/1');
  }

  if (stake > 500) {
    throw new ValidationError('El stake máximo es S/500');
  }

  if (Number(stake.toFixed(2)) !== stake) {
    throw new ValidationError('Máximo 2 decimales');
  }
}
