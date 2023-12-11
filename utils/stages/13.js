import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'

export const stagethirtteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    if (incomingMessage.button_reply.id === 'arrievedatlocation') {

      storage[customer].stage = 14;

        await Whatsapp.sendText({
            message: 'The driver has arrived at your location',
            recipientPhone: customer,
        }); 

  
          await Whatsapp.sendSimpleButtons({
            message: 'Has the driver arrived ?',
            recipientPhone: customer,
            listOfButtons: [
                {
                    title: 'Yes',
                    id:'driverarrieved',
                },
          
            ]
        })

       
        const fieldsToUpdate = {
          status: 'The driver is on their way back to the client address',
          // Add more fields as needed
        };
        
        updateDocument('Orders', storage[customer].order_no, fieldsToUpdate);
        

  }
  
      
 
  },
  
};
