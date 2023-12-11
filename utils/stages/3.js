import { storage } from '../storage.js';

export const stageThree = {
  async exec({from,incomingMessage,message,Whatsapp,recipientName}) {

    storage[from].stage = 4;
  
    storage[from].address = message;
   
    let desserts = '';
    const itens = storage[from].itens;

    itens.map((item, index) => {
          if (index == itens.length - 1) {
            desserts += index+'-'+item.description + '.';
          } else {
            desserts += index+'-'+item.description + '\n';
          }
        });

   const total = storage[from].itens.length;

   const order_summery =  `🗒️ *ORDER SUMMARY*: \n\n*${desserts}* \n Total amount: *${
    total * 6
  },00*.\n🚚 Delivery fee: R20. \n📍 Address:*${storage[from].address}* \n⏳ Delivery time: *50 minutes*. \n\n` +
    '🔊 ```The driver will come to fecth the money to pay the Resturants.```'

    //console.log(order_summery)

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

 

  },
};
