import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore,updateSdriverFirestore } from "../stages.js";

export const stageetwelve = {


  async exec({ from, Whatsapp,customer,incomingMessage,recipientName}) {


    if(incomingMessage.button_reply){


    if (incomingMessage.button_reply.id === 'arrievedatlocation') {


      const fieldsToUpdate = {
        status: 'The driver is on their way back from client errant/food order',
        // Add more fields as needed
      };

      

      var order = await getFieldValueFromFirestore(customer, "order_no");

      var address = await getFieldValueFromFirestore(customer, "address");

    
  
      updateDocument("Orders", order, fieldsToUpdate);


      const updateParams = {
        from: customer,
        updatedFields: {
          stage: 13,
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {


              await Whatsapp.sendSimpleButtons({
                message: 'Have you arrived at '+address,
                recipientPhone: from,
                listOfButtons: [
                    {
                        title: 'Yes',
                        id:'arrievedatlocation',
                    },
              
                ]
            })


            const updateParamsfordriver = {
              from:  from,
              updatedFields: {
                onroute: 'The driver is coming back from request/order!'
                // Add more fields as needed
              },
            };
      
      
            updateSdriverFirestore(updateParamsfordriver)
             .then(async () => {
    
             });
            
              await Whatsapp.sendText({
                message: 'The driver is coming back from your request!',
                recipientPhone: customer,
              }); 

  
            })

        
        .catch((error) => {
          console.error("Error:", error);
        });


        }else if(incomingMessage.button_reply.id==="cancel"){


                 
          var driver = await getFieldValueFromFirestore(from, "driver");

          var Order = await getFieldValueFromFirestore(from, "order_no");

          var address = await getFieldValueFromFirestore(from, "address");

          var admin = await getFieldValueFromFirestore(from, "admin");



          const updateParams = {
            from: from,
            updatedFields: {
              stage: 1,
              admin:"27716880654",
              itens: [],
              driver:"",
              errands:"",
              order_no :"",
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
              
      

           
    
              await Whatsapp.sendText({
    
                message: `order #${Order}, address: ${address} has been cancelled`,
                recipientPhone: driver,
                
              }); 
    
    
              await Whatsapp.sendText({
    
                message: `order #${Order}, address: ${address} has been cancelled`,
                recipientPhone:admin,
                
              }); 
    
  
  
            })
            .catch((error) => {
              console.error("Error:", error);
            });
  
  
  
        }else if(incomingMessage.button_reply.id==="continue"){
  
            await Whatsapp.sendText({
              message:
                "Thank you for your response",
              recipientPhone: from,
            });
  
        }





    }else{


          await Whatsapp.sendSimpleButtons({
            message:
                "The driver has finished with your request/order preparing to come back.",
              recipientPhone: from,
              listOfButtons: [
                {
                  title: "Continue delivery",
                  id: "continue",
                },
                {
                  title: "Cancel",
                  id: "cancel",
                },
              ],
          });


    }

 
  },
  
};
