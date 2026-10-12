import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

export const observeAuth = (onUser: (user: User | null) => void, onError: () => void) => onAuthStateChanged(auth, onUser, onError);
export const signIn = async () => (await signInWithPopup(auth, googleProvider)).user;
export const logOut = () => signOut(auth);
