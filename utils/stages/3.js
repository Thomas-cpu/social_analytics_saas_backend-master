import { storage } from '../storage.js';
import { updateStageInFirestore } from "../stages.js";
import { getFieldValueFromFirestore } from "../stages.js";

export const stageThree = {
  async exec({from,incomingMessage,message,Whatsapp,recipientName}) {



    const updateParams = {
      from: from,
      updatedFields: {
        stage: 4,
        address:message
        // Add more fields as needed
      },
    };
  
    updateStageInFirestore(updateParams)
      .then(async () => {

        let desserts = '';

        var items = await getFieldValueFromFirestore(from, "items");

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

        const order_summery =  `🗒️ *YOUR ORDER*: \n\n*${desserts}* \n\n💰 Total amount: *${
         totalPrice
       },00*. \n🚚 Delivery fee: R20. \n⏳ Delivery time: *50 minutes*. \n` +
             '🔊 ```The driver will come to fecth the money to pay the Resturants.```'
     
    
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
                    id:'Errands',
                }, 
           
            ]
        })


      })
      .catch((error) => {
        console.error('Error:', error);
      });


    

 
 

  },
};
