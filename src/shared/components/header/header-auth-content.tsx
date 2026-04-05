import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/infrastructure/auth.config';
import { getBalanceAction } from '@/modules/wallet/presentation/actions/get-balance.action';
import { Button } from '@/shared/components/ui/button';
import { HeaderUserMenu } from '@/shared/components/header/header-user-menu';

/**
 * Server component for the asynchronous auth and wallet area of the header.
 */
export async function HeaderAuthContent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <Button asChild className="rounded-full px-5">
        <Link href="/login?callbackUrl=/">Ingresar</Link>
      </Button>
    );
  }

  const wallet = await getBalanceAction();
  const userInitial = session.user.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <HeaderUserMenu
      currentBalance={wallet?.balance ?? 0}
      userInitial={userInitial}
    />
  );
}
