import { storage } from '../storage.js';

import { updateStageInFirestore } from "../stages.js";

import { updateDocument } from '../firebase_config.js'

import { getFieldValueFromFirestore } from "../stages.js";

export const stagefiveteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    
    if (incomingMessage.list_reply) {


      const fieldsToUpdate = {
        status: 'The client to write a comment',
        // Add more fields as needed
      };

      var order = await getFieldValueFromFirestore(from, "order_no");

          updateDocument('Orders',order, fieldsToUpdate);


          const updateParams = {
            from: from,
            updatedFields: {
              stage: 16,
              rating:incomingMessage.list_reply.id
              // Add more fields as needed
            },
          };

          updateStageInFirestore(updateParams)
            .then(async () => {

        
          
                  await Whatsapp.sendText({
      
                    message: 'Write any comments',
                    recipientPhone: from,
                }); 

      

      
        })
 
      }else{
        
        
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


      }
 
  },
  
};
