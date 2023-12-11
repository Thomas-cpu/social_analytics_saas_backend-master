import { storage } from '../storage.js';
import { updateDocument } from '../firebase_config.js'

export const stagefourteen = {

  async exec({ from, Whatsapp,customer,incomingMessage}) {

    if (incomingMessage.button_reply.id === 'driverarrieved') {

      const fieldsToUpdate = {
        status: 'The Order Has been delivered, waiting for client to rate',
        // Add more fields as needed
      };

      
      updateDocument('Orders', storage[from].order_no, fieldsToUpdate);

       storage[from].stage = 15;    
  
            await Whatsapp.sendRadioButtons({
              recipientPhone: from,
              headerText: 'Rate our driver',
              bodyText:'Please rate our driver to continue to give better customer service',
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
