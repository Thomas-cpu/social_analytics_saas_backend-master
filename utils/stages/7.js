
import { storage } from '../storage.js';

import { updateStageInFirestore } from '../stages.js';

export const stageseven = {

  async exec({ from,incomingMessage,message,Whatsapp ,recipientName}) {

      if (incomingMessage.button_reply) {

            if (incomingMessage.button_reply.id === 'Cancel') {

              const updateParams = {
                from: from,
                updatedFields: {
                  stage: 1,
                  itens:[]
                  // Add more fields as needed
                },
              };


                updateStageInFirestore(updateParams)
                .then(async () => {
        
                  // Stage updated successfully    
                  
                      
                    await Whatsapp.sendSimpleButtons({
                      message: "Molo "+recipientName+"! 🌟 \nHow can we assist you today? 🤔🛠️",
                      recipientPhone: from,
                      listOfButtons: [
                          {
                              title: 'Shopping',
                              id:'Shopping',
                          },
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


          }else if(incomingMessage.button_reply.id === 'changerequest') {



            
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
                          title: 'Cancel',
                          id:'Cancel',
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
            stage: 8,
            address: message
    
          },
        };

      
          updateStageInFirestore(updateParams)
          .then(async () => {

          await Whatsapp.sendSimpleButtons({
            message: '🌟 REQUEST-'+storage[from].errands+'\n-----------------------------------\n🏠ADDRESS - '+storage[from].address+'\n-----------------------------------\n',
            recipientPhone: from,
            listOfButtons: [
                {
                    title: 'Confirm',
                    id:'Confirm',
                },
                {
                  title: 'Change Request',
                  id:'changerequest',
              },
              {
                title: 'Cancel Request',
                id:'cancelrequest',
            },
              
            ]
        })

     
        })
        .catch((error) => {
          console.error('Error:', error);
        });


      // return 'REQUEST - '+storage[from].errands+'\n-----------------------------------\nADDRESS - '+storage[from].address+'\n-----------------------------------\n1️⃣ - ```CONFIRM/REQUEST DRIVER``` \n2️⃣ - ```CHANGE ERRANDS```\n*️⃣ - ```CANCEL REQUEST ```';

      }

  },
};
