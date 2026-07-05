import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDVTnH-vf5JqKATmAE5WZ7onh2cc8z2Z3A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'autoajea-homepage.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'autoajea-homepage',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'autoajea-homepage.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '611906114864',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:611906114864:web:d5525537806bff0284a4f5',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'yoonseukoh@gmail.com'
