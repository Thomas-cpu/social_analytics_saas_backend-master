import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'

export const stageten = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    if (incomingMessage.button_reply.id === 'arrievedatlocation') {

      storage[customer].stage = 11;

      const fieldsToUpdate = {
        status: 'The driver has arrived at the location of the clinet errnad/order location!',
        // Add more fields as needed
      };
      
      updateDocument('Orders', storage[customer].order_no, fieldsToUpdate);

      //storage[customer].errands

        await Whatsapp.sendSimpleButtons({
          message: 'Have you finished doing the Errand/fetching the Order ?',
          recipientPhone: from,
          listOfButtons: [
              {
                  title: 'Yes',
                  id:'arrievedatlocation',
              },
        
          ]
      })

        await Whatsapp.sendText({
          message: '🚗📍 The driver has arrived at the location of your errand/restaurant! 🌟🏠🍽️',
          recipientPhone: customer,
      }); 


    }
 
  },
  
};
