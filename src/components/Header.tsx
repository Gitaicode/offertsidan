import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/firebase';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-neutral-light">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dark">Välkommen!</h1>
            <p className="text-sm text-dark-light mt-1">
              Ditt alias för det här projektet är <span className="font-semibold">{user?.alias}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
}; 