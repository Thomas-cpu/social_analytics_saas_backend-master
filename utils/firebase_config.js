
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import {
  getFirestore,
  Timestamp,
  FieldValue,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

import serviceAccount from "./key.json" assert { type: "json" };


initializeApp({
	credential: cert(serviceAccount)
  });
  


  export const  db = getFirestore();


  
  export  async function updateDocument(collectionName, documentId, fieldsToUpdate) {
  try {
    const documentRef = db.collection(collectionName).doc(documentId);

    // Use the update method to update specific fields of the document
    await documentRef.update({
      ...fieldsToUpdate,
    });

    console.log(`Document with ID ${documentId} in collection ${collectionName} updated successfully`);
    
  } catch (error) {
    console.error('Error updating document:', error.message);
  }
}


  

  




