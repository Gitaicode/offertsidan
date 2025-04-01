import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import type { User, Bid, Project } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyC_AJRJmGTEo14IyRPI41tYt6s-6PUtJWE",
  authDomain: "anbudssidan.firebaseapp.com",
  projectId: "anbudssidan",
  storageBucket: "anbudssidan.firebasestorage.app",
  messagingSenderId: "1076649240923",
  appId: "1:1076649240923:web:9cdb8e73cba384adcc927e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const loginUser = async (email: string, password: string) => {
  console.log('Försöker logga in användare:', email);
  try {
    // Försök logga in med Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Firebase Auth lyckades, användar-ID:', userCredential.user.uid);
    
    // Hämta användardata från Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    console.log('Firestore användardata hittad:', userDoc.exists());
    
    if (!userDoc.exists()) {
      console.error('Användaren finns inte i Firestore:', userCredential.user.uid);
      throw new Error('Användardata hittades inte i databasen');
    }

    const userData = userDoc.data();
    console.log('Användardata:', { ...userData, id: userCredential.user.uid });

    return {
      ...userData,
      id: userCredential.user.uid
    } as User;
  } catch (error: any) {
    console.error('Inloggningsfel:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Felaktiga inloggningsuppgifter');
    }
    throw error;
  }
};

export const logoutUser = () => signOut(auth);

export const getUserBids = async (userId: string): Promise<Bid[]> => {
  const bidsRef = collection(db, 'bids');
  const q = query(bidsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Bid);
};

export const getAllBids = async (): Promise<Bid[]> => {
  const bidsRef = collection(db, 'bids');
  const querySnapshot = await getDocs(bidsRef);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Bid);
};

export const getProjects = async (): Promise<Project[]> => {
  const projectsRef = collection(db, 'projects');
  const querySnapshot = await getDocs(projectsRef);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Project);
}; 