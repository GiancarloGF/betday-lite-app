import { ReactNode } from 'react';

import { AppHeader } from '../header/app-header';

/**
 * AppShell provides the main layout structure for the application.
 * It includes the header and a centered content container.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <AppHeader />

      {/* Main content container */}
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
