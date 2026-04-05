'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { depositBalanceUseCase } from '@/modules/wallet/application/deposit-balance.use-case';
import type { Wallet } from '@/modules/wallet/domain/wallet';
import { ValidationError } from '@/shared/errors/app-error';

type DepositBalanceActionResult =
  | {
      ok: true;
      wallet: Wallet;
    }
  | {
      ok: false;
      errorMessage: string;
    };

/**
 * Next.js server action adapter for the wallet deposit use case.
 */
export async function depositBalanceAction(
  amount: number,
): Promise<DepositBalanceActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new ValidationError('Debes iniciar sesión para agregar saldo');
    }

    const wallet = await depositBalanceUseCase({
      amount,
      userId: session.user.id,
    });

    return {
      ok: true,
      wallet,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'No se pudo actualizar el saldo';

    return {
      ok: false,
      errorMessage,
    };
  }
}
