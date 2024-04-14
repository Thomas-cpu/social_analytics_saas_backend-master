import { storage } from '../storage.js';
import { menu } from '../menu.js';
import {driver} from '../driver.js'
import { restaurants } from '../restaurants.js';
import { getFieldValueFromFirestore } from "../stages.js";
import { updateStageInFirestore } from "../stages.js";



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


  if(await getFieldValueFromFirestore(from, "order_sent")=="No"){

          
    const updateParams = {
      from: from,
      updatedFields: {
        order_sent: "Yes",
      },
    };

    updateStageInFirestore(updateParams)
      .then(async () => {
        
  
      })
      .catch((error) => {
        console.error("Error:", error);
      });



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
        try {
          const element = driver[value];
      
          await Whatsapp.sendSimpleButtons({
            message: order_summery,
            recipientPhone: value,
            listOfButtons: [
              {
                title: 'Accept',
                id: from + '@' + 'accept',
              },
                {
                  title: 'Reject',
                  id:from+'@'+'rejected',
              },
            ]
          });
        } catch (error) {
          // Handle any errors that occur during sending the buttons
          console.error("Error sending buttons to recipient:", value, error);
        }
      });
      



      try {

        await Whatsapp.sendText({
          message: 'Your order has been sent. It will be processed shortly. 😀',
          recipientPhone: from,
        });
        
      } catch (error) {
        // Handle any errors that occur during sending the text message
        console.error("Error sending text message:", error);
      }


  }else{


    if (!incomingMessage.button_reply) {

      await Whatsapp.sendSimpleButtons({
        message: 'Your order has been sent. It will be processed shortly. 😀',
        recipientPhone: from,
        listOfButtons: [
            
          {
            title: "Continue Order",
            id: "Continue",
          },
          {
            title: "Cancel Order",
            id: "Cancel",
          },
         
        ],
      });
  

    }
  

  }

  if (incomingMessage.button_reply) {

    if (incomingMessage.button_reply.id === "Cancel"){

        
      const updateParams = {
        from: from,
        updatedFields: {
          stage: 1,
          order_sent:"No",
          items:[]
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          try {
            //storage[from].stage = 1;

              await Whatsapp.sendSimpleButtons({
                message:
                  " Molweni " +
                  recipientName +
                  "😀\n\nWe are open Monday - Sunday from 10am - 7pm⏰\n\nHow can we help you today?",
                recipientPhone: from,
                listOfButtons: [
                  {
                    title: "Request Delivery",
                    id: "Errands",
                  },
                  {
                    title: "Order food",
                    id: "Shopping",
                  },
                ],
              });


          } catch (error) {
            console.error("Error in initialStage.exec:", error);
            // Handle the error as needed, such as logging, sending a response, etc.
          }
        })
        

    }if(incomingMessage.button_reply.id === "Continue"){


      await Whatsapp.sendText({
  
        message: `Thank you for your response, We will continue with your order`,
        recipientPhone: from,
        
      }); 



    }


  }


  },
};
