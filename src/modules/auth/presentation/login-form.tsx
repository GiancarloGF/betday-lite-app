'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from '@/shared/components/ui/button';

type LoginFormProps = {
  callbackUrl: string;
};

/**
 * Starts the Google sign-in flow for the dedicated /login page.
 */
export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await signIn('google', {
      redirect: true,
      callbackUrl,
    });

    if (!result) {
      setErrorMessage('No se pudo iniciar sesión. Inténtalo nuevamente.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-5">
      {errorMessage ? (
        <p className="text-danger text-sm" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="button"
        onClick={handleSignIn}
        className="mt-2 w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Redirigiendo...' : 'Continuar con Google'}
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        Acceso exclusivo con cuenta de Google.
      </p>
    </div>
  );
}
