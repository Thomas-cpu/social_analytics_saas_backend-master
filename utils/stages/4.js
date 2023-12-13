import { storage } from '../storage.js';
import { menu } from '../menu.js';
import {driver} from '../driver.js'
import { restaurants } from '../restaurants.js';


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

 function getObjectNumberByName(nameToFind) {
  for (const [number, restaurant] of Object.entries(restaurants)) {
    if (restaurant.name === nameToFind) {
      return number;
    }
  }
  
  return null;
}

function Getres_name(nameToFind) {
  for (const [number, restaurant] of Object.entries(restaurants)) {
    if (restaurant.name === nameToFind) {
      return restaurant.name;
    }
  }
  
  return null;
}


export const stageFour = {


  exec({from,incomingMessage,message,Whatsapp,recipientName}) {

   
    Object.keys(driver).map(async (value) => {
      const element = driver[value];

        await Whatsapp.sendSimpleButtons({

          message: "You have a new food order delivery",
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
    

  },
};
