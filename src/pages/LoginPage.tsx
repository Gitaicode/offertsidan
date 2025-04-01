import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/firebase';
import { Logo } from '../components/Logo';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Försöker logga in med:', email);
      const user = await loginUser(email, password);
      console.log('Inloggning lyckades:', user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      console.error('Inloggningsfel:', err);
      setError(err.message || 'Ett fel uppstod vid inloggning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-dark p-4">
      <div className="w-full max-w-md">
        <Logo />
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Anbudshantering</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                E-post
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                Lösenord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            {error && (
              <div className="text-accent text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}; 