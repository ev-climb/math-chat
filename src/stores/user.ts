import { ref } from 'vue';
import { defineStore } from 'pinia';

import { auth, db } from '@/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
  const userData = ref<{ name: string; email?: string; scores?: number; solved_examples: string[] } | null>(null);
  const loading = ref(false);

  const getUserData = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      userData.value = docSnap.data() as { name: string; email: string; scores: number; solved_examples: string[] };
    } else {
      console.error("No such document!");
    }
  };

  const signUp = async (name: string, email: string, password: string, scores: number, solved_examples: string[]) => {
    try {
      loading.value = true;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { name, email, scores, solved_examples });
      userData.value = { name, email, scores, solved_examples };
      router.push('/');
    } catch (error) {
      console.error("Error during sign-up:", error);
    } finally {
      loading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await getUserData(user.uid);
      router.push('/');
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      loading.value = false;
    }
  };

  const addScores = async (newScores: number) => {
    try {
      if (!userData.value) {
        throw new Error("User is not logged in");
      }

      const userDocRef = doc(db, "users", auth.currentUser?.uid as string);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const updatedScores = (currentData.scores || 0) + newScores;

        await setDoc(userDocRef, { scores: updatedScores }, { merge: true });

        userData.value = { ...userData.value, scores: updatedScores };

        console.log(`User scores updated: ${updatedScores}`);
      } else {
        console.error("User document does not exist.");
      }
  
    } catch (error) {
      console.error("Error adding scores:", error);
    } 
  };
  

  const logOut = async () => {
    try {
      loading.value = true;
      await signOut(auth);
      userData.value = null;
      router.push('/');
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      loading.value = false;
    }
  };

  // Отслеживаем изменения аутентификации
  onAuthStateChanged(auth, (user) => {
    loading.value = true; 
    if (user) {
      getUserData(user.uid).then(() => {
        loading.value = false; 
      });
    } else {
      userData.value = null;
      loading.value = false;
    }
  });

  return {
    userData,
    loading,
    signUp,
    signIn,
    addScores,
    logOut,
  };
});
