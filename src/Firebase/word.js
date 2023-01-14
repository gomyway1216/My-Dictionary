import * as fbConnect from './firebaseConnect';
import { addDoc, collection, deleteDoc, getDoc, getDocs, doc, 
  updateDoc } from 'firebase/firestore';

const DOC_ID_MISSING_ERR_MSG = 'Data is not saved correctly in server.'
        + ' Document id is not returned.';

export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const addWord = async () => {
  const docRef = await addDoc(collection(getDbAccess(), 'word'), 
    {
      title: '',
      body: '',
      created: new Date(),
      lastUpdated: new Date(),
      needsEdit: true
    });
  if(!docRef.id) {
    throw new Error(DOC_ID_MISSING_ERR_MSG);
  }
  // docId is needed for autosaving.
  return docRef.id;
};

export const updateWord = async (item) => {
  const ref = doc(getDbAccess(), 'word', item.id);
  await updateDoc(ref, {
    title: item.title,
    body: item.body,
    lastUpdated: item.lastUpdated ? item.lastUpdated : new Date(),
    needsEdit: item.needsEdit
  });
};

export const getWord = async (id) => {
  const querySnapshot = await getDoc(doc(getDbAccess(), 'word', id));
  if(querySnapshot.exists()) {
    return querySnapshot.data();
  } else {
    throw new Error('Word not found!');
  }
};

export const getWords = async () => {
  const words = [];
  const querySnapshot = await getDocs(collection(getDbAccess(), 'word'));
  for(let i = 0; i < querySnapshot.docs.length; i++) {
    const wordDoc = querySnapshot.docs[i];
    const word = {
      id: wordDoc.id,
      title: wordDoc.data().title,
      body: wordDoc.data().body,
      created: new Date(wordDoc.data().created * 1000),
      lastUpdated: new Date(wordDoc.data().lastUpdated * 1000),
      needsEdit: wordDoc.data().needsEdit
    };
    words.push(word);
  }
  return words;
};

export const deleteWord = async (id) => {
  try {
    await deleteDoc(doc(getDbAccess(), 'word', id));
  } catch (err) {
    throw new Error('deleting word is failing.!');
  }
};