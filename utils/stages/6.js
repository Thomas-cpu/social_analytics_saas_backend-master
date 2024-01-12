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
      
                await Whatsapp.sendSimpleButtons({
                  message:"Molo "+recipientName+"! 🌟 \nHow can we assist you today? 🤔🛠️",
                  recipientPhone: from,
                  listOfButtons: [
                      // {
                      //     title: 'Order food',
                      //     id:'Shopping',
                      // },
                      {
                          title:'Errands',
                          id:'Errands',
                      }, 
                  
                  ]
              })

              
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
            errands:message
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
