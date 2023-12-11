import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { driver } from '../driver.js';

export const stageeight= {

  async exec({ from,incomingMessage,message,Whatsapp,recipientName }) {

          if (incomingMessage.button_reply) {

          if (incomingMessage.button_reply.id === 'Confirm') {

            storage[from].stage = 9;

              await Whatsapp.sendSimpleButtons({
                message: '🔃 GETTING A DRIVER FOR YOU. 🚗💨\n⏳ Wait a minute. ⌛️🤞',
                recipientPhone: from,
                listOfButtons: [
                    {
                        title: 'Cancel Request',
                        id:'cancel',
                    },
              
                ]
            })

     
          Object.keys(driver).map(async (value) => {
            const element = driver[value];
       
              await Whatsapp.sendSimpleButtons({
                          message: 'REQUEST - '+storage[from].errands+'\n\nADDRESS - '+storage[from].address+'',
                          recipientPhone: value,
                          listOfButtons: [
                              {
                                  title: 'Accept',
                                  id:from+'@'+'accept',
                              },
                              {
                                title: 'Reject',
                                id:from+'@'+'rejected',
                            },
                        
                          ]

                
                });

          })



        }else if(incomingMessage.button_reply.id === 'changerequest'){


          storage[from].stage = 6;

          await Whatsapp.sendSimpleButtons({
            message: "What can we do for you?",
            recipientPhone: from,
            listOfButtons: [
                {
                    title: 'Cancel',
                    id:'Cancel',
                },
             
            ]
        })
            
          

        }else if(incomingMessage.button_reply.id === 'cancelrequest'){
                 
             



        }

    }

  },
};
