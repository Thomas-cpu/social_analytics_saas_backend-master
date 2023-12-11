 import { db } from './firebase_config.js';

  
  const driversCollection = db.collection('restaurant'); 
  
  export const restaurants = {};


  driversCollection.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const restaurantsId = doc.id;
      const restaurantsData = doc.data();
      
      restaurants[restaurantsId] = {
        name: restaurantsData.name,
        status:restaurantsData.status
      };
    });
  })
  .catch(error => console.error('Error fetching driver data from Firestore:', error));



