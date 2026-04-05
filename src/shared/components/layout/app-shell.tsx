import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { getBalanceAction } from '@/modules/wallet/presentation/actions/get-balance.action';
import { AppHeader } from '../header/app-header';

/**
 * AppShell provides the main layout structure for the application.
 * It includes the header and a centered content container.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const wallet = session?.user?.id ? await getBalanceAction() : null;

  return (
    <div className="bg-background min-h-screen">
      <AppHeader currentBalance={wallet?.balance ?? 0} />

      <main className="mx-auto max-w-[1380px] px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
