import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
export const stagenine = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    if (incomingMessage.button_reply.id === 'DriverArrived') {

      const fieldsToUpdate = {
        status: 'The driver has arrived at client location',
        // Add more fields as needed
      };
      
      updateDocument('Orders', storage[customer].order_no, fieldsToUpdate);

  

      storage[customer].stage = 10;

          await Whatsapp.sendSimpleButtons({
            message: 'Have you arrived to do/fetching '+storage[customer].errands+' ?',
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


    }
 
  },

};
