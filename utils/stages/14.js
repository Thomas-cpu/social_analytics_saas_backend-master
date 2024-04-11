import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stagefourteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {


    if(incomingMessage.button_reply){


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


      
        await Whatsapp.sendSimpleButtons({
          message:
              "DO you want to?",
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
