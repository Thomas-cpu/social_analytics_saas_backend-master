import { storage } from '../storage.js';

export const stagefiveteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    
    if (incomingMessage.list_reply) {

        storage[from].rating = incomingMessage.list_reply.id;
     
        storage[from].stage = 16;    
    
            await Whatsapp.sendText({

              message: 'Write any comments',
              recipientPhone: from,
          }); 

          
      }
 
  },
  
};
