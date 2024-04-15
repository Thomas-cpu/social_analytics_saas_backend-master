import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stagenine = {

  async exec({ from, Whatsapp,customer,incomingMessage,recipientName}) {

    //console.log(incomingMessage.button_reply.id)

   if(incomingMessage.button_reply){

   

    if (incomingMessage.button_reply.id === 'DriverArrived') {


      console.log("Yes I am here");

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
            message: 'The driver has arrived at your address',
            recipientPhone: customer,
        }); 


        console.log("I have arrived ", customer);
         

        })
        .catch((error) => {
          console.error('Error:', error);
        });


    }else if(incomingMessage.button_reply.id ==="cancel"){

          var errands = await getFieldValueFromFirestore(from, "errands");

          var address = await getFieldValueFromFirestore(from, "address");

          
        const updateParams = {
          from: from,
          updatedFields: {
            stage: 1,
            admin:"27716880654",
            driver:""
         
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {
            const fieldName = "errands";

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

            message: `Your order #${Order}, address: ${address} has been cancelled`,
            recipientPhone: driver,
            
          }); 


          await Whatsapp.sendText({

            message: `The order #${Order}, address: ${address} has been cancelled`,
            recipientPhone:2716880654,
            
          }); 



          
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    }else if(incomingMessage.button_reply.id ==="continue"){

          await Whatsapp.sendText({
            message: 'Thank you for your response 😀',
            recipientPhone: from,
        }); 

    }



   }else{

    const updateParams = {
      from: from,
      updatedFields: {
        stage: 9,
      },
    };

    updateStageInFirestore(updateParams)
      .then(async () => {
        const fieldName = "errands";


          await Whatsapp.sendSimpleButtons({
          message:
            "Your designated driver is en route to your location.",
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

      })
      .catch((error) => {
        console.error("Error:", error);
      });


   }


  },

};
