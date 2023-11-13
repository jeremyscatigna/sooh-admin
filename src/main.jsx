import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import dayjs from 'dayjs';

import 'dayjs/locale/fr'

const firebaseConfig = {
  apiKey: "AIzaSyDKA0-9oe-3DiCe72QqoaaTlSZAacrBf08",
  authDomain: "sooh-77df5.firebaseapp.com",
  projectId: "sooh-77df5",
  storageBucket: "sooh-77df5.appspot.com",
  messagingSenderId: "798737708331",
  appId: "1:798737708331:web:af4978f908457015aa016e",
  measurementId: "G-9D23FNCM46"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

dayjs.locale('fr')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <UserAuthContextProvider>
        <App />
      </UserAuthContextProvider>
    </Router>
  </React.StrictMode>
);
