import { db, auth } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const seedTestData = async () => {
  try {
    // Skapa användare i Authentication och Firestore
    const testUsers = [
      { email: 'test@example.com', password: 'password123', alias: 'A', role: 'ue', id: 'user1' },
      { email: 'test2@example.com', password: 'password123', alias: 'C', role: 'ue', id: 'user2' },
      { email: 'test3@example.com', password: 'password123', alias: 'F', role: 'ue', id: 'user3' }
    ];

    for (const user of testUsers) {
      try {
        // Skapa användare i Authentication
        await createUserWithEmailAndPassword(auth, user.email, user.password);
        console.log(`Användare skapad i Auth: ${user.email}`);
      } catch (error: any) {
        // Ignorera fel om användaren redan finns
        if (error.code !== 'auth/email-already-in-use') {
          throw error;
        }
      }

      // Skapa/uppdatera användare i Firestore
      await setDoc(doc(db, 'users', user.id), {
        email: user.email,
        alias: user.alias,
        role: user.role
      });
    }

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

    console.log('Testdata har skapats framgångsrikt!');
  } catch (error) {
    console.error('Fel vid skapande av testdata:', error);
    throw error;
  }
}; 