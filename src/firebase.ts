import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromCache,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Validate Connection to Firestore on startup with offline cache fallback
export async function validateFirestoreConnection() {
  try {
    await getDocFromCache(doc(db, 'system', 'connection'));
  } catch (error) {
    // Graceful offline fallback
  }
}

validateFirestoreConnection();
