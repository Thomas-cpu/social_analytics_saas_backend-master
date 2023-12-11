import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stagethirtteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {


    if(incomingMessage.button_reply){


    if (incomingMessage.button_reply.id === 'arrievedatlocation') {

      const fieldsToUpdate = {
        status: 'The driver is on their way back to the client address',
        // Add more fields as needed
      };
      var order = await getFieldValueFromFirestore(customer, "order_no");


      updateDocument('Orders',order, fieldsToUpdate);

      
      const updateParams = {
        from: customer,
        updatedFields: {
          stage: 14,
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {


          
        await Whatsapp.sendText({
          message: 'The driver has arrived at your location',
          recipientPhone: customer,
      }); 


        await Whatsapp.sendSimpleButtons({
          message: 'Has the driver arrived ?',
          recipientPhone: customer,
          listOfButtons: [
              {
                  title: 'Yes',
                  id:'driverarrieved',
              },
        
          ]
      })
        

  
    })


      
      }
        

  }
  
      
 
  },
  
};
