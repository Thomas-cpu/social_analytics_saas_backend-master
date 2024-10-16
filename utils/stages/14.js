import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";


function transformNumber(number) {
  // Convert the number to a string
  let numberStr = number.toString();
  
  // Remove the first two digits and add a '0' at the beginning
  let transformedNumber = '0' + numberStr.slice(2);
  
  return transformedNumber;
}

import { getFieldValueFromFirestore } from "../stages.js";

export const stagefourteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {


    
    var driver = await getFieldValueFromFirestore(from, "driver");

    var Order = await getFieldValueFromFirestore(from, "order_no");

    var address = await getFieldValueFromFirestore(from, "address");

    var admin = await getFieldValueFromFirestore(from, "admin");


    if(incomingMessage.button_reply){



    if (incomingMessage.button_reply.id==="No"){


      const updateParams = {
        from: from,
        updatedFields: {
          stage: 14,
          openquery: "Yes"
          
          // Add more fields as needed
        },
      };

  
      await Whatsapp.sendText({
        message: 'We do apologize for this inconvenience, our admin team will contact you',
        recipientPhone: from,

    }); 

  }


      if (incomingMessage.button_reply.id === 'driverarrieved') {

        const fieldsToUpdate = {
          status: 'The Order Has been delivered, waiting for client to rate',
          // Add more fields as needed
        };
  

        var order = await getFieldValueFromFirestore(from, "order_no");

        updateDocument('Orders',order, fieldsToUpdate);



        const updateParams = {
          from: from,
          updatedFields: {
            stage: 15,
            // Add more fields as needed
          },
        };
  
        updateStageInFirestore(updateParams)
          .then(async () => {


            await Whatsapp.sendRadioButtons({
              recipientPhone: from,
              headerText: 'Rate our driver',
              bodyText:'Thank you for choosing cloudy Deliveries to handle your request😀\n\nPlease rate our service🌟',
              footerText: "Click here to rate",
              listOfSections: [
                  {
                      title: 'Ratings',
                      rows: [

                              {
                                  title: '1 star',
                                  description: ' ',
                                  id: '1_star',
                              },
                              {
                                  title: '2 star',
                                  description:' ',
                                  id: '2_star',
                              },
                              {
                                  title: '3 star',
                                  description:' ',
                                  id: '3_star',
                              },    
                              {
                                title: '4 star',
                                description:' ',
                                id: '4_star',
                            },
                            {
                              title: '5 star',
                              description:' ',
                              id: '5_star',
                            },

                      ],
                  },


              ],
          });
  
      })

            
    }else if(incomingMessage.button_reply.id === 'hasnotcompleed'){

            

          await Whatsapp.sendText({
            message: 'We Apologize for the delay, we will do a follow up withe driver',
            recipientPhone: from,
        }); 


        await Whatsapp.sendSimpleButtons({
          message: "Trip has not been completed successfully, please do a follow up with the driver\n\nDriver No: "+transformNumber(driver)+"\n\nCustomer No: "+transformNumber(from),
          recipientPhone: admin,
          listOfButtons: [
              {
                  title: 'Query Resolved',
                  id:from + '@' + 'query'
              },

            
          ]
      })


      await Whatsapp.sendSimpleButtons({
        message: "Trip has not been completed successfully, please contact the customer\n\nCustomer no:"+transformNumber(from),
        recipientPhone: driver,
        listOfButtons: [
            {
                title: 'Query Resolved',
                id:from + '@' + 'query'
            },

          
        ]
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



    }


    }else{



          await Whatsapp.sendSimpleButtons({
            message:
                "We Apologize for the delay, we will still doing a follow up withe driver\n\n Is the query resolved?",
              recipientPhone: from,
              listOfButtons: [
                
                {
                  title: "Yes",
                  id: "driverarrieved",
                },
                {
                  title: "No",
                  id: "No",
                },

              ],
          });
 



    }


 
  },
  
};
