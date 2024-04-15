import { storage } from "../storage.js";
import { updateDocument } from "../firebase_config.js";
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stageten = {
  async exec({ from, Whatsapp, customer, incomingMessage,recipientName }) {
    if (incomingMessage.button_reply) {

      if (incomingMessage.button_reply.id === "arrievedatlocation") {
        var order = await getFieldValueFromFirestore(customer, "order_no");

        const fieldsToUpdate = {
          status:
            "The driver has arrived at the location of the client errant/order location!",
          // Add more fields as needed
        };

        updateDocument("Orders", order, fieldsToUpdate);

        const updateParams = {
          from: customer,
          updatedFields: {
            stage: 11,
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {
 
            await Whatsapp.sendSimpleButtons({
              message:
                "Have you finished doing the Errand/fetching the Order ?",
              recipientPhone: from,
              listOfButtons: [
                {
                  title: "Yes",
                  id: "arrievedatlocation",
                },
              ],

            });

            await Whatsapp.sendText({
              message:
                "The driver has arrived at your request location",
              recipientPhone: customer,
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });

      }else if(incomingMessage.button_reply.id==="cancel"){

        const updateParams = {
          from: from,
          updatedFields: {
            stage: 1,
            itens: [],
            admin:"27716880654",
            driver:" "
            // Add more fields as needed
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {

            // Stage updated successfully

            await Whatsapp.sendText({
              message: 'We will welcome you back anytime 😀',
              recipientPhone: from,
            }); 
            
            await Whatsapp.sendSimpleButtons({
              message:
                " Molweni " +
                recipientName +
                "😀\n\nWe are open Monday - Sunday from 10am - 7pm⏰\n\nHow can we help you today?",
              recipientPhone: from,
              listOfButtons: [
  
                {
                  title: "Request Delivery",
                  id: "Errands",
                },
                {
                  title: "Order food",
                  id: "Shopping",
                },
             
              ],
            });


            
            var driver = await getFieldValueFromFirestore(from, "driver");

            var Order = await getFieldValueFromFirestore(from, "order_no");

            var address = await getFieldValueFromFirestore(from, "address");
        
            
            await Whatsapp.sendText({
  
              message: `order #${Order}, address: ${address} has been cancelled`,
              recipientPhone: driver,
              
            }); 
  
  
            await Whatsapp.sendText({
  
              message: `order #${Order}, address: ${address} has been cancelled`,
              recipientPhone:admin,
              
            }); 
  

          

          })
          .catch((error) => {
            console.error("Error:", error);
          });



      }else if(incomingMessage.button_reply.id==="continue"){

          await Whatsapp.sendText({
            message:
              "Thank you for your response",
            recipientPhone: from,
          });

      }

    } else {

      await Whatsapp.sendSimpleButtons({
            message:
                "The driver is currently busy with your request/order.",
              recipientPhone: from,
              listOfButtons: [
                {
                  title: "Continue delivery",
                  id: "continue",
                },
                {
                  title: "Cancel",
                  id: "cancel",
                },
              ],
      });

    }
  },
};
