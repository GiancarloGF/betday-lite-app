'use client';

import { useId, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

/**
 * Reusable login form for the dedicated /login page
 * and the login modal.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessageId = useId();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('demo@betday.com');
  const [password, setPassword] = useState('BetDay123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result) {
      setErrorMessage('No se pudo iniciar sesión. Inténtalo nuevamente.');
      return;
    }

    if (result.error) {
      setErrorMessage('Credenciales inválidas.');
      return;
    }

    router.push(result.url || callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase"
        >
          Email
        </label>

        <Input
          id="email"
          type="email"
          placeholder="demo@betday.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          aria-invalid={errorMessage !== null}
          aria-describedby={errorMessage ? errorMessageId : undefined}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase"
        >
          Contraseña
        </label>

        <Input
          id="password"
          type="password"
          placeholder="BetDay123"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          aria-invalid={errorMessage !== null}
          aria-describedby={errorMessage ? errorMessageId : undefined}
          required
        />
      </div>

      {errorMessage ? (
        <p
          id={errorMessageId}
          className="text-danger text-sm"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="mt-2 w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
