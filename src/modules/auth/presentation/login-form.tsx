'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';

/**
 * Starts the Google sign-in flow for the dedicated /login page.
 */
export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
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
      return;
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
    </div>
  );
}
