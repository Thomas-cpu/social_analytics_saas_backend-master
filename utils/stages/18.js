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


    let desserts = '';

    let number = 0;

    let resid = 0;

    var items = await getFieldValueFromFirestore(from, "items");

     items.map((item, index) => {
       if (index == items.length - 1) {
         desserts += index+'-'+item.description + '.';
       } else {
         desserts += index+'-'+item.description + '\n';
       }
     });

   // const total = items.length;

   var order  = await getFieldValueFromFirestore(from, "order_no");


    const totalPrice = items.reduce((total, item) => {
                 // Extract the numeric part of the price and convert it to a number
                 const itemPrice = Number(item.price.replace('R', ''));
                 
                 // Add the current item's price to the total
                 return total + itemPrice;
               }, 0);

    const order_summery =  `🗒️ *New Order #${order} Alert*: \n\nItems Ordered\n *${desserts}* \n\n💰 Total amount:R *${
     totalPrice
   },00*.\n⏳ Delivery time: *50 minutes*. \n` 
    
      items.forEach(async tShirt => {

          if(getObjectNumberByName(findItemById(tShirt.id))){
            
            number = getObjectNumberByName(findItemById(tShirt.id))

            resid =tShirt.id
          }
    
    
      });


    await Whatsapp.sendSimpleButtons({
          message: order_summery,
          recipientPhone: number,
          listOfButtons: [
              {
                  title: 'Accept ',
                  id:from+'@'+resid+'&accept'
              },
              {
                  title:'Reject',
                  id:from+'@'+resid+'&rejected',
              },
 
          ]
      })


  },
};
