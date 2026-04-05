import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { AppHeader } from '../header/app-header';

/**
 * AppShell provides the main layout structure for the application.
 * It includes the header and a centered content container.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  await getServerSession(authOptions);

  return (
    <div className="bg-background min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-345 px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
