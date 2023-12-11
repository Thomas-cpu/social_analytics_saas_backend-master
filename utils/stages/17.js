import { storage } from '../storage.js';
import { menu } from '../menu.js';
import { restaurants } from '../restaurants.js';


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


export const stageseventeen = {


  exec({from,incomingMessage,message,Whatsapp,recipientName}) {

    
    storage[from].itens.forEach(async tShirt => {

      console.log(tShirt.id)

      if(getObjectNumberByName(findItemById(tShirt.id))){
        
          tShirt.status = 'Pending'
      
          await Whatsapp.sendSimpleButtons({
            message:'Hi '+findItemById(tShirt.id)+"\n\nYou have a new order which is\n"+tShirt.description,
            recipientPhone: getObjectNumberByName(findItemById(tShirt.id)),
            listOfButtons: [
                {
                    title: 'Accept',
                    id:from+'@'+tShirt.id+'&accept',
                },
                {
                  title: 'Reject',
                  id:from+'@'+tShirt.id+'&rejected',
              },
          
            ]

        });

      }

    });


  },
};
