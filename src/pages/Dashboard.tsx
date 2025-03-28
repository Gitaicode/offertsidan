import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Header } from '../components/Header';

interface Bid {
  id: string;
  alias: string;
  price: number;
  coverage: number;
  submissionDate: string;
  isJoker: boolean;
  ranking: number;
}

interface Project {
  id: string;
  name: string;
  category: string;
  deadline: string;
  status: 'active' | 'evaluating' | 'completed';
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            .sort((a, b) => a.ranking - b.ranking);

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
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark mb-2">Projekt: {project.name}</h2>
          <p className="text-dark-light">Kategori: {project.category}</p>
          <p className="text-dark-light mt-2">
            Upphandlingen ska vara klar: {new Date(project.deadline).toLocaleDateString('sv-SE')}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-dark mb-4">
            Nedan ser du dina upphandlingar där du lämnat pris.
          </p>

          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-4 bg-neutral-light/10">
              <p className="text-dark">Status: Utvärdering pågår</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-light/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Prisplacering</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Alias</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Heltäckande offert</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark">Inlämningsdatum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-light">
                  {bids.map((bid, index) => (
                    <tr 
                      key={bid.id}
                      className={`
                        ${bid.alias === user?.alias ? 'bg-primary-light/10' : 'bg-white'}
                        hover:bg-neutral-light/10 transition-colors duration-150
                      `}
                    >
                      <td className="px-6 py-4 text-sm text-dark">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-dark">
                        {bid.alias}{bid.alias === user?.alias ? ' (du)' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark">{bid.coverage}%</td>
                      <td className="px-6 py-4 text-sm text-dark">
                        {bid.submissionDate ? new Date(bid.submissionDate).toLocaleDateString('sv-SE') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-neutral-light/10 text-sm text-dark-light italic">
              Observera att varje lista kan innehålla en fiktiv anbudsgivare. 
              Det innebär att det inte alltid är den som ligger först i prisplaceringen som vinner upphandlingen.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 