import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stagenine = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {


   if(incomingMessage.button_reply){


    if (incomingMessage.button_reply.id === 'DriverArrived') {

      const fieldsToUpdate = {
        status: 'The driver has arrived at client location',
        // Add more fields as needed
      };

      var order = await getFieldValueFromFirestore(customer, "order_no");

      var errands = await getFieldValueFromFirestore(customer, "errands");
      
      updateDocument('Orders',order, fieldsToUpdate);


      const updateParams = {
        from: customer,
        updatedFields: {
          stage: 10,
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {

          // Stage updated successfully   
          
          await Whatsapp.sendSimpleButtons({
            message: 'Have you arrived to do/fetching '+errands+' ?',
            recipientPhone: from,
            listOfButtons: [
                {
                    title: 'Yes I have arrived',
                    id:'arrievedatlocation',
                },
          
            ]
        })

          await Whatsapp.sendText({
            message: '! 🌟🏎️📍The driver has arrived at your location🌟🏠',
            recipientPhone: customer,
        }); 
         

        })
        .catch((error) => {
          console.error('Error:', error);
        });


    }



   }else{


    var errands = await getFieldValueFromFirestore(from, "errands");

    var address = await getFieldValueFromFirestore(from, "address");


    const updateParams = {
      from: from,
      updatedFields: {
        stage: 8,
      },
    };

    updateStageInFirestore(updateParams)
      .then(async () => {
        const fieldName = "errands";

        
        await Whatsapp.sendSimpleButtons({
          message:
            "🌟 REQUEST-" +
            errands+
            "\n-----------------------------------\n🏠ADDRESS - " +
            address+
            "\n-----------------------------------\n",
          recipientPhone: from,
          listOfButtons: [
            {
              title: "Confirm",
              id: "Confirm",
            },
            {
              title: "Change Request",
              id: "changerequest",
            },
            {
              title: "Cancel Request",
              id: "cancelrequest",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });


   }




 
  },

};
