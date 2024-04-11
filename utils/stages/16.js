import { storage } from '../storage.js';
import { db } from '../firebase_config.js'
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";
import { getFieldValueFromFirestore } from "../stages.js";
import { getStorageIDByDriver } from "../stages.js";

import { deleteDocumentById } from "../stages.js";

export const stagesixteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    

    var order = await getFieldValueFromFirestore(from, "order_no");

    var driver = await getFieldValueFromFirestore(from, "driver");

    var rating = await getFieldValueFromFirestore(from, "rating");

   // var Comments = await getFieldValueFromFirestore(from, "Comments");


    
  const fieldsToUpdate = {
    status: 'Completed',
    // Add more fields as needed
  };

  
  updateDocument('Orders',order, fieldsToUpdate);




    
    const collectionName="drivers"
   

    const updateParams = {
      from: from,
      updatedFields: {
        stage: 0,
        // Add more fields as needed
      },
    };

    updateStageInFirestore(updateParams)
      .then(async () => {

        if(incomingMessage.text.body){

          const newItem = {

            ratings: rating,
            client:from,
            Comments:incomingMessage.text.body,
      
          };

        }else{

          const newItem = {

            ratings: rating,
            client:from,
            Comments:"The best only from clints I hope",
      
          };



        }

  
 


  db.collection(collectionName)
  .where('phone', '==', driver)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    const documentId = doc.id;
    const menuArray = doc.data().rating || [];
    
    const trips = doc.data().trips+1;

      const updatedMenuArray = [...menuArray, newItem];

        db.collection(collectionName)
          .doc(documentId)
          .update({ rating: updatedMenuArray ,
            trips:trips})
          .then(() => {
          console.log('Item added successfully');
          })
        .catch((error) => {
        console.error('Error adding item:', error);
        });
      });
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });



    const driverValueToSearch = from;


    // Delete the document with the retrieved storageID


    try {
      // Delete the document with the specified ID
      await deleteDocumentById(from);

      await Whatsapp.sendText({

        message: 'Thank you for your comments and review',
        recipientPhone: from,

    }); 



    await Whatsapp.sendText({

      message: 'The trip is completed.',
      recipientPhone: driver,

  }); 



    } catch (error) {
      console.error('Error:', error);
    }


    

    

  
    

   




  })


  
 
  },
  
};
