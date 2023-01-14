import * as fbConnect from './firebaseConnect';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';


export const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getImageRef = async (file) => {
  const storage = fbConnect.exportStorageAccess();
  const fileRef = await ref(storage, 'word/' + file.name);

  // 'file' comes from the Blob or File API
  await uploadBytes(fileRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });

  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};