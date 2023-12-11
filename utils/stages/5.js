/**
 * The client is connection ended here. In 60 seconds, it'll closed.
 */

import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { driver } from '../driver.js';

function getDescriptionById(object, id) {
  for (const location in object) {
    const products = object[location];
    const foundProduct = products.find(product => product.id === id);

    if (foundProduct) {
      return foundProduct.description;
    }
  }

  return 'Product not found'; // You can customize the message if the ID is not found
}

function findItemById(id) {
  for (const category in menu) {
    const items = menu[category];
    const foundItem = items.find(item => item.id === id);
    if (foundItem) {
      return category;
    }
  }
  return null;
}



export const finalStage = {
  async exec({ from,incomingMessage,message,Whatsapp,recipientName }) {
    
      //console.log('There another one now');

      storage[incomingMessage.button_reply.id.split('@')[0]].stage = 5;



      const afterAt = incomingMessage.button_reply.id.split('@')[1];

      const result = afterAt.split('&')[0];


      await Whatsapp.sendText({
        message: "Your is order "+getDescriptionById(menu,result)+" complete looking for Driver for collection",
        recipientPhone: incomingMessage.button_reply.id.split('@')[0],
    });
    

    storage[incomingMessage.button_reply.id.split('@')[0]].errands ="an Order at"+findItemById(result);

           console.log(incomingMessage.button_reply.id.split('@')[0])

           console.log(storage[incomingMessage.button_reply.id.split('@')[0]].driver)
           
        await Whatsapp.sendSimpleButtons({

              message: 'Go to '+storage[incomingMessage.button_reply.id.split('@')[0]].address+" fetch money to pay for an order at "+findItemById(result)+" and return it to the client",
              recipientPhone: storage[incomingMessage.button_reply.id.split('@')[0]].driver,
              listOfButtons: [
                  {
                      title: 'Accept',
                      id:incomingMessage.button_reply.id.split('@')[0]+'@'+'accept',
                  },
                  {
                    title: 'Reject',
                    id:incomingMessage.button_reply.id.split('@')[0]+'@'+'rejected',
                },
            
              ]

          
          });




  },
};
