
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection, getDoc, updateDoc } from "firebase/firestore";

console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

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
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sign up function
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Add user to the 'users' collection in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            createdAt: new Date().toISOString(),
            isAdmin: false, // Default isAdmin to false
        });
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Sign in function
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check for an existing user document.
        // This is a self-healing measure to create a user profile if one doesn't exist,
        // which might happen for users created before this logic was implemented.
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        // If the document doesn't exist, create it.
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                email: user.email,
                createdAt: new Date().toISOString(),
                isAdmin: false, // Default new users to not be admins.
            });
        }
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Sign out function
export const logOut = async () => {
    try {
        // This function signs the user out of the Firebase client-side session
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export interface AppUser {
    id: string;
    email: string;
    createdAt: string;
    isAdmin?: boolean;
}

// Function to get a user's profile
export const getUserProfile = async (userId: string): Promise<AppUser | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as AppUser;
    }
    return null;
}

// Function to get all users (for admin panel)
export async function getUsers(): Promise<AppUser[]> {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: AppUser[] = [];
    querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as AppUser);
    });
    return users;
}

// Function to update a user's admin status
export const updateUserAdminStatus = async (userId: string, isAdmin: boolean) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { isAdmin });
};
