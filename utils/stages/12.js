import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stageetwelve = {


  async exec({ from, Whatsapp,customer,incomingMessage}) {


    if(incomingMessage.button_reply){


    if (incomingMessage.button_reply.id === 'arrievedatlocation') {


      const fieldsToUpdate = {
        status: 'The driver is on their way back from client errant/food order',
        // Add more fields as needed
      };

      

      var order = await getFieldValueFromFirestore(customer, "order_no");

      var address = await getFieldValueFromFirestore(customer, "address");

    
  
      updateDocument("Orders", order, fieldsToUpdate);


      const updateParams = {
        from: customer,
        updatedFields: {
          stage: 13,
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {


              await Whatsapp.sendSimpleButtons({
                message: 'Have you arrived at '+address,
                recipientPhone: from,
                listOfButtons: [
                    {
                        title: 'Yes',
                        id:'arrievedatlocation',
                    },
              
                ]
            })

            
            await Whatsapp.sendText({
              message: 'The driver is coming back from your request!',
              recipientPhone: customer,
          }); 

    


        

            })

        
        .catch((error) => {
          console.error("Error:", error);
        });

      

        
          

        }



    }

 
  },
  
};
