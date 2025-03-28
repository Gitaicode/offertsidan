import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const addSingleUser = async (userId: string) => {
  try {
    // Skapa användardokument
    await setDoc(doc(db, 'users', userId), {
      email: 'mikaelpersson90@hotmail.com',
      alias: 'C',
      role: 'admin', // Admin roll
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Skapa ett testanbud för användaren
    await addDoc(collection(db, 'users', userId, 'bids'), {
      projectName: 'Testprojekt',
      status: 'pending',
      amount: 100000,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Användare och testanbud har skapats');
  } catch (error) {
    console.error('Fel vid skapande av användare:', error);
    throw error;
  }
}; 