import {
  initialStage,
  stageOne,
  stageTwo,
  stageThree,
  stageFour,
  finalStage,
  stagesix,
  stageseven,
  stageeight,
  stagenine,
  stageten,
  stageeleven,
  stageetwelve,
  stagethirtteen,
  stagefourteen,
  stagefiveteen,
  stagesixteen,
  stageseventeen

} from './stages/index.js';

import { db } from './firebase_config.js';

import { storage } from './storage.js';


export const stages = [
  {
    descricao: 'Welcome',
    stage: initialStage,
  },
  {
    descricao: 'Menu',
    stage: stageOne,
  },
  {
    descricao: 'Address',
    stage: stageTwo,
  },
  {
    descricao: 'Bill',
    stage: stageThree,
  },
  {
    descricao: 'New Order',
    stage: stageFour,
  },
  {
    descricao: 'Assistent',
    stage: finalStage,
  },
  {
    descricao: 'Address',
    stage: stagesix,
  },
  {
    descricao: 'confirm',
    stage: stageseven,
  },
  {
    descricao: 'Looking for driver',
    stage: stageeight,
  },
  {
    descricao: 'Out come of driver',
    stage: stagenine,
  },
  {
    descricao: 'Getting respnonse from driver',
    stage: stageten,
  },
  {
    descricao: 'Getting stage from feedback from driver',
    stage: stageeleven,
  },
  {
    descricao: 'Getting stage from feedback from driver',
    stage: stageetwelve,
  },
  {
    descricao: 'Getting stage from feedback from driver',
    stage: stagethirtteen,
  },
  {
    descricao: 'Getting stage from feedback from driver',
    stage: stagefourteen,
  },
  {
    descricao: 'comment',
    stage: stagefiveteen,
  },
  {
    descricao: 'finish order',
    stage: stagesixteen,
  },
  {
    descricao: 'Looking for driver for resturant',
    stage: stageseventeen,
  },

];




// Assuming storage is a Firestore collection named 'storage'
const storageCollection = db.collection('storage');

const driver = db.collection('storage');

const drivers = db.collection('drivers');

export async function getStage({ from }) {
  try {
    const doc = await storageCollection.doc(from).get();

    if (doc.exists) {

      console.log("No")

      return doc.data().stage;

    } else {
      // If the document doesn't exist, create a new one and return the new stage value
      const defaultData = {
        stage: 0,
        items: [],
        address: '',
        errands: '',
        driver: '',
        order_no: 0,
        rating: 0,
        Comment: ' ',
      };

      await storageCollection.doc(from).set(defaultData);

      return defaultData.stage; // Return the new stage value
    }
  } catch (error) {
    console.error('Error retrieving stage from Firestore:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}


export async function updateStageInFirestore({ from, updatedFields }) {
  try {
    // Validate parameters
    if (typeof from !== 'string' || typeof updatedFields !== 'object') {
      throw new Error('Invalid parameter types. Expecting strings and an object.');
    }

    // Update the specified fields in the existing document
    await storageCollection.doc(from).update(updatedFields);

    console.log(`Fields updated successfully for user ${from}. Updated fields:`, updatedFields);
  } catch (error) {
    console.error('Error updating fields in Firestore:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}

export async function getFieldValueFromFirestore(docId, fieldName) {
  try {
    // Validate parameters
    if (typeof docId !== 'string' || typeof fieldName !== 'string') {
      throw new Error('Invalid parameter types. Expecting strings.');
    }

    // Retrieve the document from Firestore
    const docSnapshot = await storageCollection.doc(docId).get();

    // Check if the document exists
    if (docSnapshot.exists) {
      // Get the field value
      const fieldValue = docSnapshot.get(fieldName);

      // Return the field value
      return fieldValue;
    } else {
      throw new Error(`Document with ID ${docId} not found in Firestore.`);
    }
  } catch (error) {
    console.error('Error retrieving field value from Firestore:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}

export async function getdriverdetails(docId, fieldName) {
  try {
    // Validate parameters
    if (typeof docId !== 'string' || typeof fieldName !== 'string') {
      throw new Error('Invalid parameter types. Expecting strings.');
    }

    // Retrieve the document from Firestore
    const docSnapshot = await drivers.doc(docId).get();

    // Check if the document exists
    if (docSnapshot.exists) {
      // Get the field value
      const fieldValue = docSnapshot.get(fieldName);

      // Return the field value
      return fieldValue;
    } else {
      throw new Error(`Document with ID ${docId} not found in Firestore.`);
    }
  } catch (error) {
    console.error('Error retrieving field value from Firestore:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}

export async function doesDocumentExist(docId) {
  try {
    // Validate parameters
    if (typeof docId !== 'string') {
      throw new Error('Invalid parameter type. Expecting a string.');
    }

    // Retrieve the document from Firestore
    const docSnapshot = await driver.doc(docId).get();

    // Check if the document exists

    console.log(docSnapshot.exists)

    console.log(docId)

    return docSnapshot.exists;
  } catch (error) {
    console.error('Error checking document existence in Firestore:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}


export async function getStorageIDByDriver(driverValue) {
  try {
    // Validate parameters
    if (typeof driverValue !== 'string') {
      throw new Error('Invalid parameter type. Expecting a string.');
    }

    // Query Firestore to find the document with the specified driver value
    const querySnapshot = await storageCollection.where('driver', '==', driverValue).get();

    // Check if any documents match the query
    if (!querySnapshot.empty) {
      // Assuming there is only one matching document; if there are multiple, adjust as needed
      const storageID = querySnapshot.docs[0].id;
      return storageID;
    } else {
      return null; // Document not found
    }
  } catch (error) {
    console.error('Error retrieving storageID from Firestore by driver value:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}


export async function deleteDocumentById(docId) {
  try {
    // Validate parameters
    if (typeof docId !== 'string') {
      throw new Error('Invalid parameter type. Expecting a string.');
    }

    // Delete the document from Firestore
    await storageCollection.doc(docId).delete();

    console.log(`Document with ID ${docId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting document from Firestore:', error);
    throw error; // You may want to handle the error appropriately in your application
  }
}






