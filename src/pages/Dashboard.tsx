import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Header } from '../components/Header';
import { BidTable } from '../components/BidTable';
import { Bid } from '../types';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/firebase';
import { Logo } from '../components/Logo';

interface Project {
  id: string;
  name: string;
  category: string;
  deadline: string;
  status: 'active' | 'evaluating' | 'completed';
}

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        // Hämta projekt
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));

        if (projectsData.length > 0) {
          setProject(projectsData[0]);

          // Hämta bud för projektet
          const bidsSnapshot = await getDocs(
            query(
              collection(db, 'bids'),
              where('projectId', '==', projectsData[0].id)
            )
          );

          const bidsData = bidsSnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Bid))
            .sort((a, b) => (a.ranking ?? 0) - (b.ranking ?? 0));

          setBids(bidsData);
        }
      } catch (err) {
        setError('Ett fel uppstod när data skulle hämtas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Logo />
        </div>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Laddar...</div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Logo />
        </div>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-accent">
            {error || 'Inga projekt hittades'}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Logo />
      </div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark mb-2">Projekt: {project.name}</h2>
          <p className="text-dark-light">Kategori: {project.category}</p>
          <p className="text-dark-light mt-2">
            Upphandlingen ska vara klar: {new Date(project.deadline).toLocaleDateString('sv-SE')}
          </p>
        </div>

        <div className="bg-white p-6">
          <p className="text-dark mb-4">
            Nedan ser du dina upphandlingar där du lämnat pris.
          </p>

          <BidTable bids={bids} currentUser={user} />
        </div>

        <p className="mt-6 text-sm text-gray-600 text-center" style={{ fontStyle: 'italic' }}>
          Observera att varje lista innehåller en fiktiv anbudsgivare. Det är inte alltid den som ligger först i listan som vinner upphandligen. Detta är endast en fingervisning om din placering i upphandlingen.
        </p>

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logga ut
          </button>
        </div>
      </main>
    </div>
  );
}; 