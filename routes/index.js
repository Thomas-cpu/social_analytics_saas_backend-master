'use strict';

import { stages, getStage } from '../utils/stages.js';
import { driver } from '../utils/driver.js';
import { menu } from '../utils/menu.js';
import { restaurants } from '../utils/restaurants.js';
import { db } from '../utils/firebase_config.js';


import express from 'express';
const router = express.Router();
import Store from '../utils/store.js';
var Store1 = new Store();
const CustomerSession = new Map();

import WhatsappCloudAPI from 'whatsappcloudapi_wrapper';
import { storage } from '../utils/storage.js';

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

function generateRandomOrderNumber() {
    const timestamp = Date.now().toString(); // Get current timestamp as a string
    const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // Generate a random 6-digit number
    // const orderNumber = `${timestamp}-${randomPart}`; // Combine timestamp and random number
    const orderNumber = `${randomPart}`;
    return orderNumber;
  }


function updateStatusById(array, idToUpdate, newStatus) {
    array.forEach(item => {
      if (item.id === idToUpdate) {
        item.status = newStatus;
        console.log('updated');
      }
    });
  }

//////////////The best thing ever going to happened ///////////////////////

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


////////////////////////////////////////////////////////////////////////////////

let Whatsapp = new WhatsappCloudAPI({
    accessToken: 'EABRU3YnVXC0BOxCfCZCp6eBud2kBNZBUhi0Ign1Srsw5kTl8i6JrI1nEGhZAgEp2BwwDG96bQdwb8SZBniYJwkNpsq9S1wJFXiAmGeU4ko8ZAJQAvOsOVgQ2eL2tMTiCtRuQYZC9zB6xr4jcNoFloOfYR6e0ZBs417PKdUBZBJpWZCqcmmeXFZB5ZBYDZA5vA7Q95iDZCu5ZAT1KKKWRuE6uMed9sZD',
    senderPhoneNumberId: '107594839093339',
    WABA_ID: '112423675271755',
    
})


router.get('/callback', (req, res) => {
    try{
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if(mode && token && challenge && mode === 'subscribe' &&  'setyourandomtoken' === token){
            console.log("Get: I am verified!");
            res.status(200).send(challenge);
        }else{
            console.log("Get: I am not verified!");
            res.status(403).send('Error, wrong token');
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }    
})

function getDriverByNumber(phoneNumber) {
    for (const stoargeId in storage) {
      if (storage.hasOwnProperty(stoargeId)) {
        const currentDriver = storage[stoargeId];
        if (currentDriver.driver === phoneNumber && currentDriver.stage>8) {
          return stoargeId;
        }
      }
    }
    return null; 
  }

// await Whatsapp.sendText({
//     message: 'This just testiing',
//     recipientPhone: '27614081190',
// });

router.post('/callback',async (req, res) => {
    try{
        let data = Whatsapp.parseMessage(req.body);

        let incomingMessage = data.message;

        if(data?.isMessage){
            //let incomingMessage = data.message;

            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;

            let typeOfMsg = incomingMessage.type
            let message = ""
            if(typeOfMsg=='simple_button_message'){

                message = "Hi"

            }else if (typeOfMsg=='radio_button_message'){

                message = "Hi"
                
            }else{

                message = incomingMessage.text.body
            }
         

            let message_id = incomingMessage.message_id; 
            

             if (!driver[recipientPhone] && !restaurants[recipientPhone]) {

               const fromData = { from:recipientPhone };
               
                 getStage(fromData)
                .then((currentStage) => {


                    console.log(currentStage)

                    const messageResponse = stages[currentStage].stage.exec({

                        from: recipientPhone,
                        message: message,
                        Whatsapp:Whatsapp,
                        recipientName:recipientName,
                        incomingMessage:incomingMessage
                    });


                })
                .catch((error) => {

                    console.error('Error:', error);

                });
                
    
             }else{

                    if(incomingMessage.button_reply){


                        if(storage[incomingMessage.button_reply.id.slice(0,11)]){

                            let number  = incomingMessage.button_reply.id.slice(0,11);

                            if(storage[number].driver.trim() === ""){


                                if(getStage({ from: number})==4){

                                    storage[number].driver = recipientPhone
                                    
                                    console.log(storage[number].driver)
    
                                        const messageResponse = stages[17].stage.exec({
                                            from: number,
                                            message: message,
                                            Whatsapp:Whatsapp,
                                            recipientName:recipientName,
                                            incomingMessage:incomingMessage
                                        });
                    
                                
                                }


                            }

                          
        
                            if(incomingMessage.button_reply.id.slice(12,18)=='accept' && (getStage({ from: number})==9 || getStage({ from: number})==5)){
        
                                var The_messeage;

                                if(getStage({ from: number})==9){

                                   The_messeage =  'Request Summery\n\n'+'REQUEST : '+storage[number].errands+'\n\nADDRESS : '+storage[number].address+''
                                 
                                }else if(getStage({ from: number})==5){

                                    const totalPrice = storage[number].itens.reduce((total, item) => {
                                        // Extract the numeric part of the price and convert it to a number
                                        const itemPrice = Number(item.price.replace('R', ''));
                                        
                                        // Add the current item's price to the total
                                        return total + itemPrice;
                                      }, 0);

                                    The_messeage =  'Food Order Request\n\n'+'REQUEST : '+storage[number].errands+'\n\nADDRESS : '+storage[number].address+'\n\nDelivery Fee: R20 && Resturant Fee: '+totalPrice
                                }

                                storage[number].stage = 9;

                                console.log();

                                storage[number].driver = incomingMessage.from.phone;
                                
                                await Whatsapp.sendText({
                                    message:The_messeage,
                                    recipientPhone: incomingMessage.from.phone,
                                });   
        
        
                                await Whatsapp.sendSimpleButtons({
                                    message: 'Have you arrived at '+storage[number].address,
                                    recipientPhone: incomingMessage.from.phone,
                                    listOfButtons: [
                                        {
                                            title: 'Yes I have arrived',
                                            id:'DriverArrived',
                                        },
                                    
                                    ]
                                })
        
                                /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                
                                const randomOrderNumber = generateRandomOrderNumber();

                                    db.collection('Orders').doc(randomOrderNumber).set({
                                        Order_No: randomOrderNumber,
                                        Driver: driver[incomingMessage.from.phone].name,
                                        client: incomingMessage.button_reply.id.slice(0,11),
                                        type: "Errands",
                                        item:storage[incomingMessage.button_reply.id.slice(0,11)].errands,
                                        drop:storage[incomingMessage.button_reply.id.slice(0,11)].errands,
                                        destination: storage[incomingMessage.button_reply.id.slice(0,11)].address,
                                        status:"Driver going to client",
                                    })
                                        .then(() => {
                                        console.log('Yes'); // Print 'Yes' when the document is successfully added
                                        })
                                        .catch(error => {
                                        console.error('Error adding document to Firestore:', error);
                                        });

                                        storage[incomingMessage.button_reply.id.slice(0,11)].order_no=randomOrderNumber

                                    await Whatsapp.sendText({
                                        message:'Your orderNo#'+randomOrderNumber+' 🚗 Your driver is '+driver[incomingMessage.from.phone].name+' and he is on his way to you!🌟🏎️📍',
                                        recipientPhone: incomingMessage.button_reply.id.slice(0,11),
                                    }); 

                            }
                            
                            
                        }else{

                            if(getDriverByNumber(recipientPhone)){

                                const customernumber = getDriverByNumber(recipientPhone)
                                const currentStage = getStage({ from: customernumber});
                
                                const messageResponse = stages[currentStage].stage.exec({
                                    from: recipientPhone,
                                    message: message,
                                    Whatsapp:Whatsapp,
                                    recipientName:recipientName,
                                    incomingMessage:incomingMessage,
                                    customer:customernumber

                                });


                            }
                            

                        }


                    }

             }
        
             //  resturant   part

            if(restaurants[recipientPhone]){

                if(restaurants[recipientPhone].status=="offline"){

                    console.log('The driver number is',restaurants[recipientPhone].status);

                    const userDocRef = db.collection('restaurant').doc(recipientPhone);

                    // Use the update method to update specific fields of the document
                    userDocRef.update({
                      status: "online",
                    })

                      .then(async () => {

                        await Whatsapp.sendText({
                            message: "Hi "+recipientName+" You are now online ready to receive orders",
                            recipientPhone:recipientPhone
                        }); 
                        

                        console.log('Document updated successfully.');
                    })
                    .catch(error => {
                    console.error('Error updating document:', error);
                    });

                }

              
                    if(incomingMessage.button_reply){


                    //     if(storage[incomingMessage.button_reply.id.split('@')[0]].stage==4){

                    //         const afterAt = incomingMessage.button_reply.id.split('@')[1];

                    //         const result = afterAt.split('&')[0];


                    //         if(incomingMessage.button_reply.id.match(/accept/)){

                    //             storage[incomingMessage.button_reply.id.split('@')[0]].stage = 5; 

                    //             updateStatusById(storage[incomingMessage.button_reply.id.split('@')[0]].itens,result,'Accepted')

                    //             await Whatsapp.sendText({
                    //                 message: "Hi Your order "+getDescriptionById(menu,result)+" Has been accepted and is being prepared",
                    //                 recipientPhone:incomingMessage.button_reply.id.split('@')[0]
                    //             }); 
                                
                            
                    //             await Whatsapp.sendSimpleButtons({
                    //                 message:"Hi is order "+getDescriptionById(menu,result)+" complete ?",
                    //                 recipientPhone: recipientPhone,
                    //                 listOfButtons: [

                    //                     {
                    //                         title: 'Yes',
                    //                         id:incomingMessage.button_reply.id,
                    //                     },
                                    
                    //                 ]
                        
                    //             });
                        
                    //             //*///////

                    //         }else if(incomingMessage.button_reply.id.match(/reject/)){ 

                    //             updateStatusById(storage[incomingMessage.button_reply.id.split('@')[0]].itens,result,'Reject')


                    //             await Whatsapp.sendText({
                    //                 message: "Hi Your order "+getDescriptionById(menu,result)+" Has been rejected",
                    //                 recipientPhone:incomingMessage.button_reply.id.split('@')[0],
                    //             }); 


                    //         }

                        
                    //     }else{


                    //         if(incomingMessage.button_reply){

                    //         // const customernumber = getDriverByNumber(recipientPhone)
                    //             const currentStage = getStage({ from: incomingMessage.button_reply.id.split('@')[0]});
                
                    //             const messageResponse = stages[currentStage].stage.exec({
                    //                 from: recipientPhone,
                    //                 message: message,
                    //                 Whatsapp:Whatsapp,
                    //                 recipientName:recipientName,
                    //                 incomingMessage:incomingMessage,
                                
                    //             });


                    //         }


                    // }

                
        


            }

 


        }


        }
        res.status(200).send('OK');

    }catch(err){
        console.log(err);
        res.status(500).send(err);

        console.log("King");
    }    
});

export default router;