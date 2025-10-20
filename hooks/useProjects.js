import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, onSnapshot, doc, updateDoc, writeBatch, getDocs, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { koujiCsvData, shainCsvData, keirekiCsvData } from '../constants/initialData.js';
import { parseCSV, transformCsvDataToProjects } from '../utils/dataUtils.js';
import { formatDate } from '../utils/dateUtils.js';

export const useProjects = (user) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // NOTE: For now, data is fetched without checking for a logged-in user.
        // if (!user) {
        //     setIsLoading(false);
        //     return;
        // };

        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const fetchedProjects = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProjects(fetchedProjects);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching projects:", error);
            setIsLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [user]);

    const updateTaskDates = useCallback(async (projectId, taskId, newStartDate, newEndDate) => {
        const projectRef = doc(db, "projects", projectId);
        const projectToUpdate = projects.find(p => p.id === projectId);
        if (!projectToUpdate) {
            console.error("Project not found for updating");
            return;
        }
        const updatedTasks = projectToUpdate.tasks.map(task =>
            task.id === taskId ? { ...task, startDate: newStartDate, endDate: newEndDate } : task
        );
        try {
            await updateDoc(projectRef, { tasks: updatedTasks });
        } catch (error) {
            console.error("Error updating task dates in Firestore: ", error);
        }
    }, [projects]);


    const handleAddProject = async () => {
        const newKoujiId = prompt("新規工事IDを入力してください:");
        if (!newKoujiId) return;

        const docRef = doc(db, "projects", newKoujiId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            alert("エラー: この工事IDは既に使用されています。");
            return;
        }
        
        const newProjectName = prompt("新規工事名を入力してください:", "新規工事");
        if (!newProjectName) return;

        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30);
        const newProject = {
            id: newKoujiId,
            name: newProjectName,
            hattyusha: "",
            basho: "",
            hattyuTantou: "",
            dairininKubun: "",
            tasks: [{ 
                id: newKoujiId,
                name: newProjectName,
                workCategory: '一般作業', 
                startDate: formatDate(today), 
                endDate: formatDate(endDate), 
                progress: 0, 
                assignedTo: [] 
            }],
            manpower: {},
        };
        try {
            await setDoc(docRef, newProject);
        } catch (error) {
            console.error("Error adding new project:", error);
        }
    };

    const handleEditProject = async (project) => {
        const newName = prompt("工事名を編集:", project.name);
        const newHattyusha = prompt("発注者を編集:", project.hattyusha);
        const newBasho = prompt("場所を編集:", project.basho);
        const newHattyuTantou = prompt("発注担当を編集:", project.hattyuTantou);
        
        if (newName === null || newHattyusha === null || newBasho === null || newHattyuTantou === null) {
            return; 
        }
        
        const updatedProjectData = {
            name: newName,
            hattyusha: newHattyusha,
            basho: newBasho,
            hattyuTantou: newHattyuTantou,
        };

        try {
            await updateDoc(doc(db, "projects", project.id), updatedProjectData);
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };
    
    const handleDeleteProject = async (projectId) => {
        const confirmation = prompt(`工事ID "${projectId}" を削除します。よろしいですか？\n削除するには「DELETE」と入力してください。`);
        if (confirmation === 'DELETE') {
            try {
                await deleteDoc(doc(db, "projects", projectId));
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    const seedData = async () => {
        const projectsCollection = collection(db, `projects`);
        const shainCollection = collection(db, `shain`);
        const [projectsSnap, shainSnap] = await Promise.all([
            getDocs(projectsCollection), getDocs(shainCollection)
        ]);

        if (!projectsSnap.empty || !shainSnap.empty) {
            alert("Data already exists in one or more collections. Seeding was cancelled.");
            return;
        }

        const batch = writeBatch(db);
        const initialProjectsFromCsv = transformCsvDataToProjects(koujiCsvData, shainCsvData, keirekiCsvData);

        initialProjectsFromCsv.forEach(project => {
            const docRef = doc(projectsCollection, project.id);
            batch.set(docRef, project);
        });

        const shainData = parseCSV(shainCsvData);
        shainData.forEach(shain => {
             if (shain.社員番号) {
                const docRef = doc(shainCollection, shain.社員番号);
                batch.set(docRef, shain);
             }
        });

        try {
          await batch.commit();
          alert("Successfully seeded data to Firestore (projects, shain).");
        } catch(error) {
          console.error("Failed to seed data:", error);
          alert("An error occurred. Check the console for details.");
        }
    };

    return { projects, setProjects, isLoading, updateTaskDates, seedData, handleAddProject, handleEditProject, handleDeleteProject };
};
