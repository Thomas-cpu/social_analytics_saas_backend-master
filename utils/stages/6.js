import { menu } from '../menu.js';
import { storage } from '../storage.js';

import { updateStageInFirestore } from '../stages.js';

export const stagesix = {

  async exec({ from,incomingMessage,message,Whatsapp,recipientName}) {


    if(incomingMessage.button_reply){


          if (incomingMessage.button_reply.id === 'Cancel') {

           // const updateData = { from: from, newStage: 1 };

            
            const updateParams = {
              from: from,
              updatedFields: {
                stage: 1,
                // Add more fields as needed
              },
            };
                
      
            updateStageInFirestore(updateParams)
              .then(async () => {
      

                await Whatsapp.sendText({
                  message: 'We will welcome you back anytime 😀',
                  recipientPhone: customer,
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

                var admin = await getFieldValueFromFirestore(from, "admin");

             
      
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
                console.error('Error:', error);
              });

  
        }

      }else{

        const updateParams = {
          from: from,
          updatedFields: {
            stage: 7,
            errands:message,
            admin:"27716880654",
            // Add more fields as needed
          },
        };
      
        updateStageInFirestore(updateParams)
          .then(async () => {

           // storage[from].errands = message;
  
            await Whatsapp.sendSimpleButtons({
              message: "🗺️ Now enter the ADDRESS (Number, Street, Neighborhood)  🏠✉️🌍",
              recipientPhone: from,
              listOfButtons: [
                  {
                      title: 'Cancel',
                      id:'Cancel',
                  },
                  {
                    title: 'Change Request',
                    id:'changerequest',
                },
                
              ]
          })
  
           

  
          })
          .catch((error) => {
            console.error('Error:', error);
          });

         

    
      }

  
  },



};
