import { storage } from '../storage.js';
import { updateStageInFirestore } from "../stages.js";
import { getFieldValueFromFirestore } from "../stages.js";

function generateRandomOrderNumber() {
  const timestamp = Date.now().toString(); // Get current timestamp as a string
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0"); // Generate a random 6-digit number
  // const orderNumber = `${timestamp}-${randomPart}`; // Combine timestamp and random number
  const orderNumber = `${randomPart}`;
  return orderNumber;
}

export const stageThree = {
  async exec({from,incomingMessage,message,Whatsapp,recipientName}) {



    if(!incomingMessage.button_reply){


      const randomOrderNumber = generateRandomOrderNumber();
    
      const updateParams = {
        from: from,
        updatedFields: {
          stage: 4,
          address:message,
          order_no:randomOrderNumber
          // Add more fields as needed
        },
      };
    
      updateStageInFirestore(updateParams)
        .then(async () => {
  
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
  
        const order_summery =  `🗒️ *ORDER SUMMARY #${randomOrderNumber}*: \n\n*${desserts}* \n\n💰 Total amount: *${
        totalPrice
      },00*. \n🚚 Delivery fee: R20. \n🏡 Restaurants: ${restaurant} \n🏡Address: ${message} \n⏳ Delivery time: *50 minutes*. \n` +
            '🔊 ```The driver will come fetch the money to pay the restaurants.```'
       
      
          await Whatsapp.sendSimpleButtons({
              message: order_summery,
              recipientPhone: from,
              listOfButtons: [
                  {
                      title: 'send order',
                      id:'finsh_order',
                  },
                  {
                      title:'cancel',
                      id:'Cancel',
                  }, 
             
              ]
          })
  
  
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      


    }else{

       if(incomingMessage.button_reply.id=="Cancel"){

        const updateParams = {
          from: from,
          updatedFields: {
            stage: 1,
            errands:"",
            order_no :"",
            admin:"27716880654",
            items: [],
            // Add more fields as needed
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {
            // Stage updated successfully

            await Whatsapp.sendText({
              message: 'We will welcome you back anytime 😀',
              recipientPhone: from,
          }); 

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

           

          })
          .catch((error) => {
            console.error("Error:", error);
          });


       }


      }

  

  


  },
};
