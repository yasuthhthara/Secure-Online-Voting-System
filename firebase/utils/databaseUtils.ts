import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { database } from "../config";

export const createData = (collectionName: string, data: object, onSuccess: (data: any) => void, onError: (data: any) => void) => {
    addDoc(collection(database, collectionName), data)
        .then((res) => {
            onSuccess(res);
        }).catch((e) => {
            console.error(e.message);
            onError(e);
        })
}

export const getDataFromCollection = async (collectionName: string): Promise<any> => {
    let dataList: any[] = [];

    const q = query(collection(database, collectionName));
    const documents = await getDocs(q);
    documents.forEach((doc) => {
        dataList.push({...doc.data(), id: doc.id})
    });

    return dataList;
}

export const getSingleDataFromCollection = async (collectionName: string, docId: string): Promise<any> => {
    const ref = doc(database, collectionName, docId);

    const document = await getDoc(ref);
     if (document.exists()) {
        return document.data()
     } else {
        return {error: "Document not found"}
     }
}

export const updateFromCollection = async (collectionName: string, updatedData: object, docId: string, onSuccess: (data: any) => void, onError: (data: any) => void) => {
    const ref = doc(database, collectionName, docId);

    await setDoc(ref, updatedData)
        .then((res) => {
            onSuccess(res);
        })
        .catch(e => {console.error(e); onError(e);})
}

export const deleteFromCollection = async (collectionName: string, docId: string, onSuccess: (data: any) => void, onError: (data: any) => void) => {
    await deleteDoc(doc(database, collectionName, docId))
        .then((res) => {
            onSuccess(res);
        })
        .catch((e) => {
            onError(e);
        })
}