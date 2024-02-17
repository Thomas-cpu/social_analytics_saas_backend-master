import { storage } from '../storage.js';
import { menu } from '../menu.js';
import {driver} from '../driver.js'
import { restaurants } from '../restaurants.js';
import { getFieldValueFromFirestore } from "../stages.js";


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


  async exec({from,incomingMessage,message,Whatsapp,recipientName}) {


    let desserts = '';

    var items = await getFieldValueFromFirestore(from, "items");

    var restaurant  = await getFieldValueFromFirestore(from, "Restaurant");

     items.map((item, index) => {
       if (index == items.length - 1) {
         desserts += index+'-'+item.description + '.';
       } else {
         desserts += index+'-'+item.description + '\n';
       }
     });

   // const total = items.length;

    const totalPrice = items.reduce((total, item) => {
                 // Extract the numeric part of the price and convert it to a number
    const itemPrice = Number(item.price.replace('R', ''));
    
    // Add the current item's price to the total
    return total + itemPrice;
  }, 0);

// summary

  const order_summery =  `🗒️ *New Order Alert*: \n\n*${desserts}* \n\n💰 Total amount: *${
  totalPrice
},00*. \n🚚 Delivery fee: R20. \n🏡 Restaurants: ${restaurant} \n⏳ Delivery time: *50 minutes*. \n` +
      '🔊 ```You will go the client location to fetch money for the resturant```'


   
    Object.keys(driver).map(async (value) => {
      const element = driver[value];

        await Whatsapp.sendSimpleButtons({

          message:order_summery,
          recipientPhone: value,
          listOfButtons: [
              {
                  title: 'Accept',
                  id:from+'@'+'accept',
              },
            //   {
            //     title: 'Reject',
            //     id:from+'@'+'rejected',
            // },
        
          ]

          
        });


    })


    await Whatsapp.sendText({
      message: 'Your order has been sent. It will be processed shortly. 😀',
      recipientPhone: from,
  }); 
    

    

  },
};
