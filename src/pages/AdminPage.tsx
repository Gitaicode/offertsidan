import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { logoutUser } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

interface Bid {
  id: string;
  alias: string;
  price: number;
  coverage: number;
  submissionDate: string;
  isJoker: boolean;
  comment?: string;
}

interface Project {
  id: string;
  name: string;
  category: string;
  deadline: string;
  status: 'active' | 'evaluating' | 'completed';
}

interface User {
  id: string;
  email: string;
  alias: string;
  role: 'admin' | 'ue';
}

export const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hämta användare
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User));
        setUsers(usersData);

        // Hämta projekt
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        setProjects(projectsData);

        if (projectsData.length > 0) {
          setProject(projectsData[0]);

          // Hämta alla bud för projektet
          const bidsSnapshot = await getDocs(
            query(
              collection(db, 'bids'),
              where('projectId', '==', projectsData[0].id),
              orderBy('price')
            )
          );
          const bidsData = bidsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Bid));
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
  }, []);

  const handleUpdateAlias = async (userId: string, newAlias: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        alias: newAlias,
        updatedAt: new Date()
      });
      setUsers(users.map(u => u.id === userId ? { ...u, alias: newAlias } : u));
    } catch (err) {
      console.error('Fel vid uppdatering av alias:', err);
    }
  };

  const handleUpdateBid = async (bidId: string, updates: Partial<Bid>) => {
    try {
      await updateDoc(doc(db, 'bids', bidId), {
        ...updates,
        updatedAt: new Date()
      });
      setBids(bids.map(b => b.id === bidId ? { ...b, ...updates } : b));
    } catch (err) {
      console.error('Fel vid uppdatering av bud:', err);
    }
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        bids.map(bid => 
          updateDoc(doc(db, 'bids', bid.id), {
            ...bid,
            updatedAt: new Date()
          })
        )
      );
      // Uppdatera projekt deadline om det ändrats
      if (project) {
        await updateDoc(doc(db, 'projects', project.id), {
          deadline: project.deadline,
          updatedAt: new Date()
        });
      }
    } catch (err) {
      console.error('Fel vid sparande:', err);
      setError('Ett fel uppstod när ändringar skulle sparas');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  if (loading) {
    return <div>Laddar...</div>;
  }

  if (error || !project) {
    return <div className="text-red-600">{error || 'Inget projekt hittades'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Adminvy - Anbudsutvärdering</h1>
      
      <p className="mb-8 text-gray-600">
        När du lägger in det första riktiga anbudet, föreslås att jokern placeras på plats 1–2. När 
        fler anbud tillkommer föreslås plats 1–3. Du kan manuellt justera alla jokerparametrar 
        (pris, placering, alias).
      </p>

      <h2 className="text-2xl font-bold mb-6">Projekt: {project.name}</h2>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Kategori: {project.category}</h3>
          
          <div className="flex items-center gap-4">
            <label htmlFor="deadline" className="font-medium">
              Upphandlingen ska vara klar:
            </label>
            <input
              type="date"
              id="deadline"
              value={project.deadline}
              onChange={(e) => setProject({ ...project, deadline: e.target.value })}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Alias</th>
              <th className="text-left py-2">Pris</th>
              <th className="text-left py-2">Heltäckande offert (%)</th>
              <th className="text-left py-2">Inlämningsdatum</th>
              <th className="text-left py-2">Kommentar</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr 
                key={bid.id}
                className={bid.isJoker ? 'bg-[#fff9e6]' : 'hover:bg-gray-50'}
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bid.alias}
                      onChange={(e) => handleUpdateBid(bid.id, { alias: e.target.value })}
                      className="border rounded w-16 px-2 py-1"
                    />
                    {bid.isJoker && (
                      <span className="text-sm text-gray-500">joker</span>
                    )}
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={bid.price}
                    onChange={(e) => handleUpdateBid(bid.id, { price: Number(e.target.value) })}
                    className="border rounded w-32 px-2 py-1"
                  />
                </td>
                <td>
                  <select
                    value={bid.coverage}
                    onChange={(e) => handleUpdateBid(bid.id, { coverage: Number(e.target.value) })}
                    className="border rounded px-2 py-1"
                  >
                    {[80, 85, 90, 95, 100].map(value => (
                      <option key={value} value={value}>{value}%</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    value={bid.submissionDate}
                    onChange={(e) => handleUpdateBid(bid.id, { submissionDate: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={bid.comment || ''}
                    onChange={(e) => handleUpdateBid(bid.id, { comment: e.target.value })}
                    className="border rounded w-full px-2 py-1"
                    placeholder="Lägg till kommentar..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
          <button
            onClick={handleSaveAll}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}; 