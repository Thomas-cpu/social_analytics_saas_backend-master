import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { driver } from '../driver.js';
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stageeight= {

  async exec({ from,incomingMessage,message,Whatsapp,recipientName }) {

    var errands = await getFieldValueFromFirestore(from, "errands");

    var address = await getFieldValueFromFirestore(from, "address");

        if (incomingMessage.button_reply) {

           

          if (incomingMessage.button_reply.id === 'Confirm') {

            const updateParams = {
              from: from,
              updatedFields: {
                stage: 9,
    
                // Add more fields as needed
              },
            };
    
            updateStageInFirestore(updateParams)
              .then(async () => {

              
                  await Whatsapp.sendSimpleButtons({
                    message: 'Finding you a driver. ⌛️',
                    recipientPhone: from,
                    listOfButtons: [
                        {
                            title: 'Cancel Request',
                            id:'cancel',
                        },
                  
                    ]
                })

              })
              .catch((error) => {
                console.error("Error:", error);
              });
              
              const driverKeys = Object.keys(driver);

              for (const value of driverKeys) {
                const element = driver[value];
              
                try {
                  await Whatsapp.sendSimpleButtons({
                    message: 'REQUEST - ' + errands + '\n\nADDRESS - ' + address + '',
                    recipientPhone: value,
                    listOfButtons: [
                      {
                        title: 'Accept',
                        id: from + '@' + 'accept',
                      },
                      {
                        title: 'Reject',
                        id: from + '@' + 'rejected',
                      },
                    ]
                  });
                  console.log(`Message sent successfully to ${value}`);
                } catch (error) {
                  console.error(`Error sending message to ${value}: ${error.message}`);
                  // Handle the error as needed
                }
              }
              



        }else if(incomingMessage.button_reply.id === 'changerequest'){


          const updateParams = {
            from: from,
            updatedFields: {
              stage: 6,
              driver:""
  
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
            
          

        }else if(incomingMessage.button_reply.id === 'cancelrequest'){

          const updateParams = {
            from: from,
            updatedFields: {
              stage: 1,
              itens: [],
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
              

            })
            .catch((error) => {
              console.error("Error:", error);
            });



        }

    }else{


      const updateParams = {
        from: from,
        updatedFields: {
          stage: 8,
          driver:"",
          address: message,
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          const fieldName = "errands";

          
          // await Whatsapp.sendSimpleButtons({
          //   message:
          //     "🌟 REQUEST-" +
          //     errands+
          //     "\n-----------------------------------\n🏠ADDRESS - " +
          //     address+
          //     "\n-----------------------------------\n",
          //   recipientPhone: from,
          //   listOfButtons: [
          //     {
          //       title: "Confirm",
          //       id: "Confirm",
          //     },
          //     {
          //       title: "Change Request",
          //       id: "changerequest",
          //     },
          //     {
          //       title: "Cancel Request",
          //       id: "cancelrequest",
          //     },
          //   ],
          // });

        })
        .catch((error) => {
          console.error("Error:", error);
        });


    

    }

  },
};
