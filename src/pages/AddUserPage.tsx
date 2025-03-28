import { useState } from 'react';
import { addSingleUser } from '../services/addUser';

export const AddUserPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  const handleAddUser = async () => {
    if (!userId.trim()) {
      setError('Du måste ange ett användar-ID');
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      await addSingleUser(userId);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark p-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Lägg till användare i Firestore</h1>
        
        <div className="space-y-6">
          <div className="bg-neutral-light/20 rounded-lg p-4">
            <h3 className="font-semibold text-dark mb-2">Instruktioner:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-dark-light">
              <li>Gå till Firebase Console - Authentication</li>
              <li>Hitta din användare (mikaelpersson90@hotmail.com)</li>
              <li>Kopiera User UID (det långa ID:t)</li>
              <li>Klistra in det i fältet nedan</li>
            </ol>
          </div>

          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-dark mb-2">
              Firebase Authentication User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input"
              placeholder="Klistra in User UID här"
            />
          </div>

          <div className="bg-neutral-light/20 rounded-lg p-4">
            <h3 className="font-semibold text-dark mb-2">Användarinformation som kommer att skapas:</h3>
            <ul className="space-y-1 text-sm text-dark-light">
              <li>Email: mikaelpersson90@hotmail.com</li>
              <li>Alias: C</li>
              <li>Roll: Admin</li>
            </ul>
          </div>

          <button
            onClick={handleAddUser}
            disabled={status === 'loading'}
            className="btn-primary w-full"
          >
            {status === 'loading' ? 'Lägger till...' : 'Lägg till i Firestore'}
          </button>

          {status === 'success' && (
            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
              <p className="text-accent-dark text-center font-medium">
                Användare har lagts till i Firestore!
              </p>
              <p className="text-sm text-dark-light text-center mt-2">
                Du kan nu logga in med dina inloggningsuppgifter.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 text-accent text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 