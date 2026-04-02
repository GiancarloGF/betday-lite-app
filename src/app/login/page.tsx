import { LoginForm } from '@/modules/auth/presentation/login-form';

/**
 * Dedicated sign-in page required for middleware redirects
 * and accessibility-friendly authentication flow.
 */
export default function LoginPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4 py-10">
      <div className="border-border bg-card w-full max-w-md rounded-2xl border p-8 shadow-sm">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-brand text-3xl font-bold">BetDay Lite</h1>
          <h2 className="text-foreground text-xl font-semibold">Ingresar</h2>
          <p className="text-muted-foreground text-sm">
            Usa las credenciales demo para continuar.
          </p>
        </div>

        <LoginForm />

        <div className="bg-surface-muted text-muted-foreground mt-6 rounded-xl p-4 text-sm">
          <p className="text-foreground font-medium">Credenciales demo</p>
          <p>Email: demo@betday.com</p>
          <p>Password: BetDay123</p>
        </div>
      </div>
    </main>
  );
}
