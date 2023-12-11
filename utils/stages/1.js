import { db } from '../firebase_config.js';
import { updateStageInFirestore } from '../stages.js';

const restaurantsCollection = db.collection('restaurant');

const fetchRestaurants = async () => {
  try {
    const snapshot = await restaurantsCollection.where('status', '==', 'online').get();
    
    return snapshot.docs.map(doc => ({
      title: doc.data().name,
      description: doc.data().description,
      id: doc.data().name,
    }));
  } catch (error) {
    console.error('Error fetching online restaurant data from Firestore:', error);
    throw error;
  }
};


////////////////////////////////////////////////

export const stageOne = {
  async exec({ from, incomingMessage, Whatsapp,recipientName }) {

  if(incomingMessage.button_reply){

    if (incomingMessage.button_reply.id === 'Shopping') {

        
      const updateParams = {
        from: from,
        updatedFields: {
          stage: 2,
          // Add more fields as needed
        },
      };
      
        updateStageInFirestore(updateParams)
          .then(async () => {


            //storage[from].stage = 2;
            // Fetch restaurant data and replace existing rows
            const restaurantData = await fetchRestaurants();
      
              console.log(restaurantData.length)
      
              if(restaurantData.length === 0){
      
                console.log("The best thing ever")
      
                await Whatsapp.sendText({
                    message: "Hi unfortunately there are no resturants available at moment please try again in 10 minutes",
                    recipientPhone:from
                }); 
      
              }else{
      
                console.log(restaurantData)
        
                  await Whatsapp.sendRadioButtons({
                    recipientPhone: from,
                    headerText: 'Select the restaurant you want',
                    bodyText: 'All restaurants on this app are trusted brands',
                    footerText: 'Approved by Cloudy Delivery',
      
                    listOfSections: [
                      {
                        title: 'Top 10 Restaurant',
                        rows: restaurantData,
                      },
                    ],
                  });
      
              }

        

        // Stage updated successfully          
       

      })
      .catch((error) => {
        console.error('Error:', error);
      });


  
    } else if (incomingMessage.button_reply.id === 'Errands') {

      
      const updateParams = {
        from: from,
        updatedFields: {
          stage: 6,
          // Add more fields as needed
        },
      };

     // const updateData = { from: from, newStage: 6 };
      
      updateStageInFirestore(updateParams)
        .then(async () => {

          //storage[from].stage = 6;

          await Whatsapp.sendSimpleButtons({
            message: "🌟 What can we do for you? 🚀😊",
            recipientPhone: from,
            listOfButtons: [
              {
                title: 'Cancel',
                id: 'Cancel',
              },
            ],
          });

          // Stage updated successfully          
    

        })
        .catch((error) => {
          console.error('Error:', error);
        });



    }


  }else{


    const updateParams = {
      from: from,
      updatedFields: {
        stage: 6,
        // Add more fields as needed
      },
    };


    updateStageInFirestore(updateParams)
        .then(async () => {

          try {

            //storage[from].stage = 1;
      
            await Whatsapp.sendSimpleButtons({
              message: " Molo " + recipientName + "! 🌟 \nHow can we assist you today? 🤔🛠️",
              recipientPhone: from,
              listOfButtons: [
                {
                  title: 'Order food',
                  id: 'Shopping',
                },
                {
                  title: 'Errands',
                  id: 'Errands',
                },
              ]
            });
          } catch (error) {
            console.error('Error in initialStage.exec:', error);
            // Handle the error as needed, such as logging, sending a response, etc.
          }
      

        })
        .catch((error) => {
          console.error('Error:', error);
        });



 
  

  }

   


  },
};
