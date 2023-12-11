import { storage } from '../storage.js';
import { db } from '../firebase_config.js'
import { updateDocument } from '../firebase_config.js'

export const stagesixteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    storage[from].Comment = incomingMessage.text.body;
    
    const collectionName="drivers"

    const newItem = {

        ratings: storage[from].rating,
        client:from,
        Comments: storage[from].Comment,

			};


    db.collection(collectionName)
		.where('phone', '==', storage[from].driver) // Use a field that uniquely identifies your main document
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
			const documentId = doc.id;
			const menuArray = doc.data().rating || [];
      
      const trips = doc.data().trips+1;

			// Add the new item to the existing 'menu' array
        const updatedMenuArray = [...menuArray, newItem];

        // Update the document with the modified 'menu' array
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

      storage[from].stage = 0;    

      await Whatsapp.sendText({

        message: 'Thank you for your comments and review',
        recipientPhone: from,

    }); 


    await Whatsapp.sendText({

      message: 'The trip is completed.',
      recipientPhone: storage[from].driver,

  }); 
 
  const fieldsToUpdate = {
    status: 'Completed',
    // Add more fields as needed
  };
  
  updateDocument('Orders', storage[from].order_no, fieldsToUpdate);
 
  },
  
};
