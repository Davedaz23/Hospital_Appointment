// firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyAf4UwOrRbshGi907MRF1k_k_fZNy9gPm4',
    authDomain: 'ssms-28a95.firebaseapp.com',
    projectId: 'ssms-28a95',
    storageBucket: 'ssms-28a95.firebasestorage.app',
    messagingSenderId: '667659395686',
    appId: '1:667659395686:android:5b2ad6c94e10f2a2b6c3a7',
    databaseURL: 'https://ssms-28a95-default-rtdb.firebaseio.com',
  };
  

const app = initializeApp(firebaseConfig);
export default app;