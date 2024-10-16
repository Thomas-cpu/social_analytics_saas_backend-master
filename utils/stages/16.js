import { storage } from '../storage.js';
import { db } from '../firebase_config.js'
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore,updateSdriverFirestore } from "../stages.js";
import { getFieldValueFromFirestore,getdriverdetails } from "../stages.js";
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


   

    const updateParams = {
      from: from,
      updatedFields: {
        stage: 0,
        admin:"27716880654",
        // Add more fields as needed
      },
    };

    updateStageInFirestore(updateParams)
      .then(async () => {

      
  const newItem = {

    ratings: rating,
    client:from,
    Comments:incomingMessage.text.body,

  };



  db.collection("drivers")
  .where('phone', '==', driver)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    const documentId = doc.id;
    const menuArray = doc.data().rating || [];
  
      const updatedMenuArray = [...menuArray, newItem];

        db.collection("drivers")
          .doc(documentId)
          .update({ rating: updatedMenuArray}
          
          )
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


  var trips = await getdriverdetails(driver,"trips")

  
  const updateParamsfordriver = {
    from:  driver,
    updatedFields: {
      onroute: 'false',
      trips: trips+1

      // Add more fields as needed
    },
  };


  updateSdriverFirestore(updateParamsfordriver)
   .then(async () => {

   });



    } catch (error) {
      console.error('Error:', error);
    }

  })


  },
  
};
