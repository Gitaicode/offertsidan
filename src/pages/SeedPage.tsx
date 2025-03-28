import { useState } from 'react';
import { seedFirestoreOnly } from '../services/seedFirestore';

export const SeedPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setStatus('loading');
    setError(null);
    try {
      await seedFirestoreOnly();
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-dark mb-6">Skapa testdata i Firestore</h1>
        
        <div className="space-y-4">
          <div className="bg-neutral-light/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-dark mb-2">Viktigt!</h3>
            <p className="text-sm text-dark-light">
              Innan du skapar Firestore-data, se till att du har skapat följande användare i Firebase Authentication:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-dark-light">
              <li>• test@example.com / password123 (Användare A)</li>
              <li>• test2@example.com / password123 (Användare C)</li>
              <li>• test3@example.com / password123 (Användare F)</li>
            </ul>
          </div>

          <p className="text-dark-light">
            Detta kommer att skapa följande data i Firestore:
          </p>
          <ul className="list-disc list-inside text-dark-light space-y-2">
            <li>Ett projekt (Autogyron 3 - Garage)</li>
            <li>Tre användarprofiler (A, C, F)</li>
            <li>Tre anbud med olika priser och täckning</li>
          </ul>

          <button
            onClick={handleSeed}
            disabled={status === 'loading'}
            className="btn-primary w-full mt-6"
          >
            {status === 'loading' ? 'Skapar data...' : 'Skapa Firestore-data'}
          </button>

          {status === 'success' && (
            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
              <p className="text-accent-dark text-center font-medium">
                Firestore-data har skapats framgångsrikt!
              </p>
              <p className="text-sm text-dark-light text-center mt-2">
                Du kan nu logga in med någon av användarna ovan.
              </p>
            </div>
          )}

          {error && (
            <p className="text-accent mt-4 text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 