import { storage } from "../storage.js";

import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stageseven = {
  async exec({ from, incomingMessage, message, Whatsapp, recipientName }) {
    if (incomingMessage.button_reply) {
      if (incomingMessage.button_reply.id === "Cancel") {

        const updateParams = {
          from: from,
          updatedFields: {
            stage: 1,
            admin:"27716880654",
            itens: [],
            errands:"",
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

          })
          .catch((error) => {
            console.error("Error:", error);
          });


      } else if (incomingMessage.button_reply.id === "changerequest") {

        const updateParams = {
          from: from,
          updatedFields: {
            stage: 6,

            // Add more fields as needed
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {
            await Whatsapp.sendSimpleButtons({
              message: "🌟 What can we do for you? 🚀😊",
              recipientPhone: from,
              listOfButtons: [
                {
                  title: "Cancel",
                  id: "Cancel",
                },
              ],
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      
    } else {


      const updateParams = {
        from: from,
        updatedFields: {
          stage: 8,
          address: message,
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          const fieldName = "errands";

        //  const errands = await getFieldValueFromFirestore(from, "errands");

          const address = await getFieldValueFromFirestore(from, "address");

           
          await Whatsapp.sendSimpleButtons({
            message:
              "🏠Address - " +
              address+
              "\n-----------------------------------\n",
            recipientPhone: from,
            listOfButtons: [
              {
                title: "Confirm",
                id: "Confirm",
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

        
      // return 'REQUEST - '+storage[from].errands+'\n-----------------------------------\nADDRESS - '+storage[from].address+'\n-----------------------------------\n1️⃣ - ```CONFIRM/REQUEST DRIVER``` \n2️⃣ - ```CHANGE ERRANDS```\n*️⃣ - ```CANCEL REQUEST ```';
    }
  },
};
