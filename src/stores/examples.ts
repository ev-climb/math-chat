import { defineStore } from "pinia";
import { ref } from "vue";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from '@/firebaseConfig';

export const useExamplesStore = defineStore("examples", () => {
  const examplesList = ref<any[]>([]);
  const loading = ref(false);

  // Функция для получения примеров с определенного уровня
  const fetchExamples = async (level: string) => {
    try {
      loading.value = true;
      const problemsCollectionRef = collection(db, "examples", level, "problems");
      const querySnapshot = await getDocs(problemsCollectionRef);
      examplesList.value = [];
      querySnapshot.forEach((doc) => {
        examplesList.value.push({ id: doc.id, ...doc.data() });
      });
      console.log(examplesList.value);
      return examplesList.value;
    } catch (error) {
      console.error("Error fetching examples:", error);
    } finally {
      loading.value = false;
    }
  };

  const uploadExamples = async (examples: any[], level: number) => {
    const batch = writeBatch(db);
  
    examples.forEach((exampleData) => {
      const newExampleRef = doc(collection(db, `examples/${level}/problems`));
      batch.set(newExampleRef, exampleData);
    });

    try {
      await batch.commit();
      console.log("Все примеры успешно загружены!");
    } catch (error) {
      console.error("Ошибка при загрузке примеров:", error);
    }
  };

  return {
    examplesList,
    loading,
    fetchExamples,
    uploadExamples
  };
});
