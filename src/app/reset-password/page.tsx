import { ResetPasswordContent } from '@/components/auth';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback='Loading...'>
      <ResetPasswordContent />
    </Suspense>
  );
}
