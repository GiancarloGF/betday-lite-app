'use client';

import { useState } from 'react';
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
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Email
        </label>

        <Input
          id="email"
          type="email"
          placeholder="demo@betday.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
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
          required
        />
      </div>

      {errorMessage ? (
        <p className="text-danger text-sm">{errorMessage}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
