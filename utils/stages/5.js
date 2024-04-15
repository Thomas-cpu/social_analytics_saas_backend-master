/**
 * The client is connection ended here. In 60 seconds, it'll closed.
 */

import { menu } from '../menu.js';
import { storage } from '../storage.js';
import { driver } from '../driver.js';
import { updateStageInFirestore } from "../stages.js";
import { getFieldValueFromFirestore } from "../stages.js";

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


    if(incomingMessage.button_reply){

  
    if(incomingMessage.button_reply.id=="Cancel"){

             const updateParams = {
            from: from,
            updatedFields: {
              stage: 1,
              order_sent:"No",
              admin:"27716880654",
              items:[]
            },
          };

          updateStageInFirestore(updateParams)
            .then(async () => {
              try {

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
              }
            })
      


    } else if(incomingMessage.button_reply.id=="Continue"){

         
      await Whatsapp.sendText({
  
        message: `Thank you for your response, We will continue with your order`,
        recipientPhone: from,
        
      }); 


    }else{


      let restaurant = await getFieldValueFromFirestore(incomingMessage.button_reply.id.split('@')[0], "Restaurant");


      const updateParams = {
        from: incomingMessage.button_reply.id.split('@')[0],
        updatedFields: {
          stage: 5,
          errands :"an Order at "+restaurant
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          try {
       
            var driver = await getFieldValueFromFirestore(incomingMessage.button_reply.id.split('@')[0], "driver");
    
            var Order_No = await getFieldValueFromFirestore(incomingMessage.button_reply.id.split('@')[0], "order_no");

            var address = await getFieldValueFromFirestore(incomingMessage.button_reply.id.split('@')[0], "address");

          
              await Whatsapp.sendText({
                message: `Your order # ${Order_No} is complete getting Driver for collection`,
                recipientPhone: incomingMessage.button_reply.id.split('@')[0],
            });
            
                  
          await Whatsapp.sendSimpleButtons({

                message: 'Go to '+address+" fetch money to pay for an order "+Order_No+" at "+restaurant+" and return it to the client",
                recipientPhone: driver,
                listOfButtons: [
                    {
                        title: 'Going there now',
                        id:incomingMessage.button_reply.id.split('@')[0]+'@'+'accept',
                    },
                  //   {
                  //     title: 'Reject',
                  //     id:incomingMessage.button_reply.id.split('@')[0]+'@'+'rejected',
                  // },
              
                ]

            
            });

          


          } catch (error) {
            console.error("Error in initialStage.exec:", error);
          }
        })



    }


    
     
    }else{


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

    
  },
};
