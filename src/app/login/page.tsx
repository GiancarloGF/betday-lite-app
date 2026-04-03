import { LoginForm } from '@/modules/auth/presentation/login-form';
import { createPageMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Ingresar',
  description: 'Accede con las credenciales demo para probar la aplicacion.',
  path: '/login',
  index: false,
});

/**
 * Dedicated sign-in page required for middleware redirects
 * and accessibility-friendly authentication flow.
 */
export default function LoginPage() {
  return (
    <main className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.12))]" />
      <div className="bg-card relative w-full max-w-md rounded-[1.9rem] border border-white/80 p-8 shadow-[0_34px_90px_-42px_rgba(15,23,42,0.35)]">
        <div className="mb-8 space-y-3 text-center">
          <h1 className="text-brand text-4xl font-black tracking-tight">
            BetDayLite
          </h1>
          <h2 className="text-foreground text-3xl font-semibold">Ingresar</h2>
          <p className="text-muted-foreground text-sm">
            Usa las credenciales demo para continuar.
          </p>
        </div>

        <LoginForm />

        <div className="bg-surface-muted text-muted-foreground mt-6 rounded-2xl border border-white/70 p-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <p className="text-foreground font-medium">Credenciales demo</p>
          <p>Email: demo@betday.com</p>
          <p>Password: BetDay123</p>
        </div>
      </div>
    </main>
  );
}
