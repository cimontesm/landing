import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVote =  (productID) => {
    const votesRef = ref(database, 'votes');
    const newVoteRef = push(votesRef);
    return set(newVoteRef, {
        productID: productID,
        timestamp: Date.now()
    })
    .then(() => ({ status: 'success', message: 'Voto guardado correctamente' }))
    .catch((error) => ({ status: 'error', message: error?.message || String(error) }));
}

const getVotes = async() => {
    const votesRef = ref(database, 'votes');
    try {
        const snapshot = await get(votesRef);
        if (snapshot.exists()) {
            return { status: 'success', data: snapshot.val() };
        } else {
            return { status: 'success', data: 'No hay datos' };
        }
    } catch (error) {
        return { status: 'error', message: error?.message || String(error) };
    }
}

export { saveVote, getVotes };

