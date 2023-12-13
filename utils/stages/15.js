import { storage } from '../storage.js';

import { updateStageInFirestore } from "../stages.js";

import { updateDocument } from '../firebase_config.js'

import { getFieldValueFromFirestore } from "../stages.js";

export const stagefiveteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    
    if (incomingMessage.list_reply) {


      const fieldsToUpdate = {
        status: 'The client to write a comment',
        // Add more fields as needed
      };

      var order = await getFieldValueFromFirestore(from, "order_no");

      updateDocument('Orders',order, fieldsToUpdate);


      const updateParams = {
        from: from,
        updatedFields: {
          stage: 16,
          rating:incomingMessage.list_reply.id
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {

     
      
              await Whatsapp.sendText({
  
                message: 'Write any comments',
                recipientPhone: from,
            }); 

  

  
    })


   

          
      }else{




      }
 
  },
  
};
