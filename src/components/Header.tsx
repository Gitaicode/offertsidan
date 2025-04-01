import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user } = useAuth();

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
        </div>
      </div>
    </header>
  );
}; 