import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'

export const stageetwelve = {



  async exec({ from, Whatsapp,customer,incomingMessage}) {

    if (incomingMessage.button_reply.id === 'arrievedatlocation') {

      storage[customer].stage = 13;

          await Whatsapp.sendSimpleButtons({
            message: 'Have you arrived at '+storage[customer].address,
            recipientPhone: from,
            listOfButtons: [
                {
                    title: 'Yes',
                    id:'arrievedatlocation',
                },
          
            ]
        })

        
        await Whatsapp.sendText({
          message: '🚗🔄 The driver is on their way back from your errand/food order! 🌟🍽️',
          recipientPhone: customer,
      }); 

      const fieldsToUpdate = {
        status: 'The driver is on their way back from client errand/food order',
        // Add more fields as needed
      };
      
      updateDocument('Orders', storage[customer].order_no, fieldsToUpdate);

    }
 
  },
  
};
