import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stageeleven = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {


    if(incomingMessage.button_reply){


      if (incomingMessage.button_reply.id === 'arrievedatlocation') {
  
        const fieldsToUpdate = {
          status: 'The driver has completed the request',
          // Add more fields as needed
        };

        var order = await getFieldValueFromFirestore(customer, "order_no");

        var address = await getFieldValueFromFirestore(customer, "address");

        updateDocument("Orders", order, fieldsToUpdate);


        const updateParams = {
          from: customer,
          updatedFields: {
            stage: 12,
            // Add more fields as needed
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {

            await Whatsapp.sendSimpleButtons({
              message: 'Are you going back to '+address,
              recipientPhone: from,
              listOfButtons: [
                  {
                      title: 'Yes',
                      id:'arrievedatlocation',
                  },
            
              ]
          })
  
                await Whatsapp.sendText({
                  message: 'The driver has completed the request',
                  recipientPhone: customer,
              }); 
                // Stage updated successfully

              })

          
          .catch((error) => {
            console.error("Error:", error);
          });
        
      }


    }else{


    }

 
 
  },
  
};
