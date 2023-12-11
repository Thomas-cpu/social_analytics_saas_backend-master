


import { db } from './firebase_config.js';

  
const driversCollection = db.collection('restaurant'); 

export const menu = {};


driversCollection.get()
.then(snapshot => {
  snapshot.forEach(doc => {

    const restaurantsData = doc.data();
  
    menu[restaurantsData.name] =restaurantsData.menu


  });
})
.catch(error => console.error('Error fetching driver data from Firestore:', error));








// const menu = {

//   Jordans: [
//     {
//       title: 'Black LVX T-Shirt',
//       description: 'R2999.00\nLVX is a warm cotton t-shirt',
//       id: 'SKU12_black_lvx_tshirt',
//     },

//   ],


// };

// // Export the menu object
// export { menu };