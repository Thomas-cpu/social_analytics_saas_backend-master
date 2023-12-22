
 
 import { db } from './firebase_config.js';

  const driversCollection = db.collection('drivers'); 
  
  export const driver = {};

  console.log("The best")

  const isDriverEmpty = Object.keys(driver).length === 0;

  if (isDriverEmpty) {

    driversCollection.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const driverId = doc.id;
        const driverData = doc.data();
        
        driver[driverId] = {
          name: driverData.name,
          staus: driverData.staus
        };
      });
    })
    .catch(error => console.error('Error fetching driver data from Firestore:', error));
    
  } else {

    driversCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docData = change.doc.data();
        const docId = change.doc.id;
    
        if (change.type === 'added') {
          console.log(`Document added with ID ${docId}:`, docData);
          // Handle added document
        } else if (change.type === 'modified') {
          console.log(`Document modified with ID ${docId}:`, docData);
          // Handle modified document
        } else if (change.type === 'removed') {
          console.log(`Document removed with ID ${docId}:`, docData);
          // Handle removed document
        }
      });
    });
    



  }





  



