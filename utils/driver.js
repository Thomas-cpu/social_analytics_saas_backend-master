
 
 import { db } from './firebase_config.js';

  const driversCollection = db.collection('drivers'); 
  
  function formatPhoneNumber(phoneNumber) {
    // Check if the number starts with '0'
    if (phoneNumber.startsWith('0')) {
        // Replace the first '0' with '27'
        return phoneNumber.replace(/^0/, '27');
    } 
    // If it starts with '27', return it as is
    else if (phoneNumber.startsWith('27')) {
        return phoneNumber;
    }
    // If it's in a different format, return it unmodified
    return phoneNumber;
}



  export const driver = {};

 

  const isDriverEmpty = Object.keys(driver).length === 0;

  if (isDriverEmpty) {

    console.log("The best")


    driversCollection.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        
        const driverId = doc.data().phone;
        const driverData = doc.data();

       //console.log(driver.data().phone)
        
        driver[driverId] = {
          name: driverData.name,
          status: driverData.status
        };

        //console.log(driver)
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





  



