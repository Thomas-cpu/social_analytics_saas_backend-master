
 
 import { db } from './firebase_config.js';

  const driversCollection = db.collection('drivers'); 
  
  export const driver = {};


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



