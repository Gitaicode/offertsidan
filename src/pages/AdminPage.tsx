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
  ranking: number;
  projectId: string;
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

        // Hämta alla bud för första projektet
        if (projectsData.length > 0) {
          const bidsSnapshot = await getDocs(
            query(
              collection(db, 'bids'),
              where('projectId', '==', projectsData[0].id),
              orderBy('ranking')
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

  const handleToggleJoker = async (bidId: string, isJoker: boolean) => {
    try {
      await updateDoc(doc(db, 'bids', bidId), {
        isJoker,
        updatedAt: new Date()
      });
      setBids(bids.map(b => b.id === bidId ? { ...b, isJoker } : b));
    } catch (err) {
      console.error('Fel vid uppdatering av joker:', err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  if (loading) {
    return <div>Laddar...</div>;
  }

  const project = projects[0];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Välkommen!</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 rounded">
          Logga ut
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Projekt:</h2>
        <p>Kategori: {project?.category}</p>
        <p>Upphandlingen ska vara klar: {project?.deadline ? new Date(project.deadline).toLocaleDateString('sv-SE') : '-'}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Underentreprenörer</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Email</th>
              <th className="text-left">Alias</th>
              <th className="text-left">Roll</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.role === 'ue').map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.alias}
                    onChange={(e) => handleUpdateAlias(user.id, e.target.value)}
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(alias => (
                      <option key={alias} value={alias}>{alias}</option>
                    ))}
                  </select>
                </td>
                <td>Underentreprenör</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Anbud</h2>
        <p className="mb-4">Status: Utvärdering pågår</p>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Prisplacering</th>
              <th className="text-left">Alias</th>
              <th className="text-left">Heltäckande offert</th>
              <th className="text-left">Inlämningsdatum</th>
              <th className="text-left">Joker</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={bid.id}>
                <td>{index + 1}</td>
                <td>{bid.alias}</td>
                <td>{bid.coverage}%</td>
                <td>
                  {bid.submissionDate ? new Date(bid.submissionDate).toLocaleDateString('sv-SE') : '-'}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={bid.isJoker}
                    onChange={(e) => handleToggleJoker(bid.id, e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm italic">
          Observera att varje lista kan innehålla en fiktiv anbudsgivare. 
          Det innebär att det inte alltid är den som ligger först i prisplaceringen som vinner upphandlingen.
        </p>
      </div>
    </div>
  );
}; 