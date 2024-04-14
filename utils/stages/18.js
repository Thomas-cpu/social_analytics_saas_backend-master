import { storage } from '../storage.js';
import { menu } from '../menu.js';
import { restaurants } from '../restaurants.js';
import { getFieldValueFromFirestore } from "../stages.js";



function findItemById(id) {
  for (const category in menu) {
    const items = menu[category];

    console.log(menu)
    const foundItem = items.find(item => item.id === id);
    if (foundItem) {
      return category;
    }
  }
  return null;
}

 function getObjectNumberByName(nameToFind) {
  for (const [number, restaurant] of Object.entries(restaurants)) {
    if (restaurant.name === nameToFind) {
      return number;
    }
  }
  
  return null;
}


export const stageeightteen = {


  async exec({from,incomingMessage,message,Whatsapp,recipientName}) {

  
        await Whatsapp.sendText({
          message:incomingMessage.message,
          recipientPhone: from,
        });

       
  },


};
