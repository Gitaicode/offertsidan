import { db, auth } from './firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const seedTestData = async () => {
  try {
    // Skapa användare i Authentication och Firestore
    const testUsers = [
      { email: 'test@example.com', password: 'password123', alias: 'A', role: 'ue' },
      { email: 'test2@example.com', password: 'password123', alias: 'C', role: 'ue' },
      { email: 'test3@example.com', password: 'password123', alias: 'F', role: 'ue' }
    ];

    const createdUsers = [];

    for (const user of testUsers) {
      try {
        // Försök skapa ny användare eller logga in existerande
        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
          console.log(`Ny användare skapad i Auth: ${user.email}`);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            // Om användaren finns, logga in för att få UID
            userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
            console.log(`Befintlig användare hittad: ${user.email}`);
          } else {
            throw authError;
          }
        }

        // Spara användaren och UID för senare användning
        const userId = userCredential.user.uid;
        createdUsers.push({
          ...user,
          id: userId
        });

        // Skapa/uppdatera användare i Firestore oavsett om den är ny eller befintlig
        await setDoc(doc(db, 'users', userId), {
          email: user.email,
          alias: user.alias,
          role: user.role
        });
        console.log(`Firestore-data uppdaterad för: ${user.email}`);
      } catch (error: any) {
        console.error(`Fel vid hantering av användare ${user.email}:`, error);
        throw error;
      }
    }

    // Skapa testprojekt
    await setDoc(doc(db, 'projects', 'project1'), {
      name: 'Autogyron 3 - Garage',
      category: 'Ventilation',
      deadline: '2026-04-12',
      status: 'evaluating'
    });
    console.log('Projekt skapat');

    // Skapa testanbud med de faktiska användar-ID:n
    if (createdUsers.length > 0) {
      await setDoc(doc(db, 'bids', 'bid1'), {
        userId: createdUsers[0].id,
        alias: 'A',
        projectId: 'project1',
        price: 455000,
        coverage: 90,
        submissionDate: '',
        isJoker: true,
        ranking: 1
      });

      if (createdUsers.length > 1) {
        await setDoc(doc(db, 'bids', 'bid2'), {
          userId: createdUsers[1].id,
          alias: 'C',
          projectId: 'project1',
          price: 460000,
          coverage: 85,
          submissionDate: '2026-03-15',
          isJoker: false,
          ranking: 2
        });
      }

      if (createdUsers.length > 2) {
        await setDoc(doc(db, 'bids', 'bid3'), {
          userId: createdUsers[2].id,
          alias: 'F',
          projectId: 'project1',
          price: 470000,
          coverage: 80,
          submissionDate: '',
          isJoker: false,
          ranking: 3
        });
      }
      console.log('Anbud skapade');
    }

    console.log('Testdata har skapats framgångsrikt!');
  } catch (error) {
    console.error('Fel vid skapande av testdata:', error);
    throw error;
  }
}; 