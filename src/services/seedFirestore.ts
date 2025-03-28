import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const seedFirestoreOnly = async () => {
  try {
    // Skapa användare i Firestore
    await setDoc(doc(db, 'users', 'user1'), {
      email: 'test@example.com',
      alias: 'A',
      role: 'ue'
    });

    await setDoc(doc(db, 'users', 'user2'), {
      email: 'test2@example.com',
      alias: 'C',
      role: 'ue'
    });

    await setDoc(doc(db, 'users', 'user3'), {
      email: 'test3@example.com',
      alias: 'F',
      role: 'ue'
    });

    // Skapa testprojekt
    await setDoc(doc(db, 'projects', 'project1'), {
      name: 'Autogyron 3 - Garage',
      category: 'Ventilation',
      deadline: '2026-04-12',
      status: 'evaluating'
    });

    // Skapa testanbud
    await setDoc(doc(db, 'bids', 'bid1'), {
      userId: 'user1',
      alias: 'A',
      projectId: 'project1',
      price: 455000,
      coverage: 90,
      submissionDate: '',
      isJoker: true,
      ranking: 1
    });

    await setDoc(doc(db, 'bids', 'bid2'), {
      userId: 'user2',
      alias: 'C',
      projectId: 'project1',
      price: 460000,
      coverage: 85,
      submissionDate: '2026-03-15',
      isJoker: false,
      ranking: 2
    });

    await setDoc(doc(db, 'bids', 'bid3'), {
      userId: 'user3',
      alias: 'F',
      projectId: 'project1',
      price: 470000,
      coverage: 80,
      submissionDate: '',
      isJoker: false,
      ranking: 3
    });

    console.log('Firestore-data har skapats framgångsrikt!');
  } catch (error) {
    console.error('Fel vid skapande av Firestore-data:', error);
    throw error;
  }
}; 