
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string; // Changed from Firestore Timestamp to string
  type: 'contact' | 'order';
  phone?: string;
  company?: string;
  riceType?: string;
  quantity?: string;
}

export async function getInquiries(): Promise<Submission[]> {
  const querySnapshot = await getDocs(collection(db, "submissions"));
  const submissions: Submission[] = [];
  querySnapshot.forEach((doc) => {
    submissions.push({ id: doc.id, ...doc.data() } as Submission);
  });
  return submissions;
}

export async function getOrders(): Promise<Submission[]> {
  const querySnapshot = await getDocs(collection(db, "orders"));
  const submissions: Submission[] = [];
  querySnapshot.forEach((doc) => {
    submissions.push({ id: doc.id, ...doc.data() } as Submission);
  });
  return submissions;
}


export async function saveSubmission(submissionData: any) {
  try {
    const collectionName = submissionData.type === 'order' ? 'orders' : 'submissions';
    const docRef = await addDoc(collection(db, collectionName), {
      ...submissionData,
      timestamp: new Date().toISOString(),
    });
    return { success: true, message: "Submission saved", id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, message: "Error saving submission" };
  }
}

export async function deleteSubmission(id: string, type: 'contact' | 'order') {
  try {
    const collectionName = type === 'order' ? 'orders' : 'submissions';
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return { success: false, message: "Error deleting submission" };
  }
}

