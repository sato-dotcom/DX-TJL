import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, onSnapshot, doc, setDoc, getDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export const useShain = (user, projects) => {
    const [shainList, setShainList] = useState([]);

    useEffect(() => {
        // if (!user) return;

        const unsubscribe = onSnapshot(collection(db, "shain"), (snapshot) => {
            const fetchedList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setShainList(fetchedList);
        }, (error) => console.error("Error fetching shain list:", error));

        return () => unsubscribe();
    }, [user]);

    const handleAddShain = async () => {
        const shainId = prompt("新規社員番号を入力してください:");
        if (!shainId) return;

        const docRef = doc(db, "shain", shainId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            alert("エラー: この社員番号は既に使用されています。");
            return;
        }

        const sei = prompt("姓を入力:", "");
        const mei = prompt("名を入力:", "");
        const jimusho = prompt("事業所を入力:", "山口支店");
        const busho = prompt("部署を入力:", "工事部");
        const email = prompt("メールアドレスを入力:", "");

        if (!sei || !mei) return;

        const newShain = {
            社員番号: shainId,
            姓: sei,
            名: mei,
            事業所: jimusho,
            部署: busho,
            メールアドレス: email,
        };

        try {
            await setDoc(docRef, newShain);
        } catch (e) {
            console.error("Error adding new shain:", e);
        }
    };

    const handleEditShain = async (shain) => {
        const sei = prompt("姓を編集:", shain.姓);
        const mei = prompt("名を編集:", shain.名);
        const jimusho = prompt("事業所を編集:", shain.事業所);
        const busho = prompt("部署を編集:", shain.部署);
        const email = prompt("メールアドレスを編集:", shain.メールアドレス);

        if (sei === null || mei === null || jimusho === null || busho === null || email === null) {
            return;
        }

        const updatedShain = {
            姓: sei,
            名: mei,
            事業所: jimusho,
            部署: busho,
            メールアドレス: email,
        };

        try {
            await updateDoc(doc(db, "shain", shain.id), updatedShain);
        } catch (e) {
            console.error("Error updating shain:", e);
        }
    };

    const handleDeleteShain = async (shainId) => {
        const confirmation = prompt(`社員番号 "${shainId}" を削除します。よろしいですか？\n関連する工事の担当者からも削除されます。\n削除するには「DELETE」と入力してください。`);
        if (confirmation !== 'DELETE') return;

        const batch = writeBatch(db);

        // 1. Delete the shain document
        const shainRef = doc(db, "shain", shainId);
        batch.delete(shainRef);

        // 2. Remove shainId from all projects' assignedTo arrays
        projects.forEach(project => {
            let needsUpdate = false;
            const updatedTasks = project.tasks.map(task => {
                if (task.assignedTo && task.assignedTo.includes(shainId)) {
                    needsUpdate = true;
                    return {
                        ...task,
                        assignedTo: task.assignedTo.filter(id => id !== shainId)
                    };
                }
                return task;
            });

            if (needsUpdate) {
                const projectRef = doc(db, "projects", project.id);
                batch.update(projectRef, { tasks: updatedTasks });
            }
        });

        try {
            await batch.commit();
        } catch (e) {
            console.error("Error deleting shain and updating projects:", e);
        }
    };

    return { shainList, handleAddShain, handleEditShain, handleDeleteShain };
};
