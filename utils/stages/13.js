import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stagethirtteen = {

  async exec({ from, Whatsapp,customer,incomingMessage,recipientName}) {


    if(incomingMessage.button_reply){


      if (incomingMessage.button_reply.id === 'arrievedatlocation') {

        const fieldsToUpdate = {
          status: 'The driver is on their way back to the client address',
          // Add more fields as needed
        };
        var order = await getFieldValueFromFirestore(customer, "order_no");


        updateDocument('Orders',order, fieldsToUpdate);

        
        const updateParams = {
          from: customer,
          updatedFields: {
            stage: 14,
            // Add more fields as needed
          },
        };

            updateStageInFirestore(updateParams)
              .then(async () => {


                
              await Whatsapp.sendText({
                message: 'The driver has arrived at your address',
                recipientPhone: customer,
            }); 


              await Whatsapp.sendSimpleButtons({
                message: 'Has the driver completed your request ?',
                recipientPhone: customer,
                listOfButtons: [
                    {
                        title: 'Yes ✅',
                        id:'driverarrieved',
                    },
                    {
                      title: 'No ❌',
                      id:'hasnotcompleed',
                    },
              
                ]
            })
              

        
          })


        
        }else if(incomingMessage.button_reply.id==="cancel"){

          const updateParams = {
            from: from,
            updatedFields: {
              stage: 1,
              itens: [],
              admin:"27716880654",
              driver:"",
              errands:"",
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
              
            
              var driver = await getFieldValueFromFirestore(from, "driver");

              var Order = await getFieldValueFromFirestore(from, "order_no");
    
              var address = await getFieldValueFromFirestore(from, "address");

              var admin = await getFieldValueFromFirestore(from, "admin");

           
    
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
