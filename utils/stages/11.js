import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'

export const stageeleven = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    if (incomingMessage.button_reply.id === 'arrievedatlocation') {

      storage[customer].stage = 12;

      const fieldsToUpdate = {
        status: 'The driver has finished with client errand/order',
        // Add more fields as needed
      };
      
      updateDocument('Orders', storage[customer].order_no, fieldsToUpdate);

      //+

          await Whatsapp.sendSimpleButtons({
            message: 'Are you going back to '+storage[customer].address,
            recipientPhone: from,
            listOfButtons: [
                {
                    title: 'Yes',
                    id:'arrievedatlocation',
                },
          
            ]
        })

          await Whatsapp.sendText({
            message: '🚗✅ The driver has finished with your errand/order! 🌟🍽️',
            recipientPhone: customer,
        }); 


    }
 
  },
  
};
