// firestoreConfig.js
import { getFirestore } from 'firebase/firestore';
import app from './firebaseConfig';  // Import the Firebase app

const db = getFirestore(app);
export default db;