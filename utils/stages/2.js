import { menu } from '../menu.js';
import { db } from '../firebase_config.js';
import { storage } from '../storage.js';

var Thelastrelpy_id;

// Assume you have a 'restaurants' collection in Firestore
const restaurantsCollection = db.collection('restaurant');

// Fetch restaurant data from Firestore
const fetchRestaurants = async () => {
  try {
    const snapshot = await restaurantsCollection.get();
    return snapshot.docs.map(doc => ({
      title: doc.data().name, // Assuming 'name' is a field in the restaurant document
      description: doc.data().name, // Adjust as per your Firestore schema
      id: doc.data().name,
    }));
  } catch (error) {
    console.error('Error fetching restaurant data from Firestore:', error);
    return [];
  }
};



export const stageTwo = {

  async exec({ from,incomingMessage,message,Whatsapp,recipientName }) {

  

    if(incomingMessage.list_reply){


      const restaurantExists = await checkRestaurantExists(incomingMessage.list_reply.id);

      console.log(restaurantExists)

    if(restaurantExists){

        const menuItems = menu[incomingMessage.list_reply.id];

        Thelastrelpy_id=incomingMessage.list_reply.id;

        const transformedItems = menuItems.map(item => {
            return {
              title: item.title,
              description: item.description,
              id: item.id
            };

          });


          await Whatsapp.sendRadioButtons({
            
            recipientPhone: from,
            headerText: incomingMessage.list_reply.id+' Food Menu',
            bodyText:
                'Pick one product at a time',
            footerText: 'Approved by Cloudy deliveries',
            listOfSections: [
                {
                    title: 'Break Fast',
                    rows: transformedItems,
                },

            ],
        });


    }
    

      const menuItems = menu[Thelastrelpy_id];

        if(menuItems){
 
          if(menuItems.find(item => item.id === incomingMessage.list_reply.id)){


            if(storage[from].itens.push(menuItems.find(item => item.id === incomingMessage.list_reply.id))){

                await Whatsapp.sendSimpleButtons({
                    message: "You want to",
                    recipientPhone: from,
                    listOfButtons: [
                        {
                            title: 'add another item',
                            id:'add_more',
                        },
                
                        {
                          title: 'view order',
                          id:'view_order',
                        },
                      {
                        title: 'cancel',
                        id:'cancel',
                    },
                      
                    ]
                })

                storage[from].stage = 2;

            }


        }

        }

      
    }


    if(incomingMessage.button_reply){

      const restaurantExists = await checkRestaurantExists(Thelastrelpy_id);

        if(incomingMessage.button_reply.id=='add_more'){

            if(restaurantExists){


              const menuItems = menu[Thelastrelpy_id];
                const transformedItems = menuItems.map(item => {
                    return {
                      title: item.title,
                      description: item.description,
                      id: item.id
                    };
                  });
    
                await Whatsapp.sendRadioButtons({
                
                    recipientPhone: from,
                    headerText: Thelastrelpy_id+' Food Menu',
                    bodyText:
                        'Pick one product at a time',
                    footerText: 'Approved by Cloudy deliveries',
                    listOfSections: [
                        {
                            title: 'Break Fast',
                            rows: transformedItems,
                        },
        
                    ],
                });


            }

         
        }else if(incomingMessage.button_reply.id=='view_order'){

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

           const order_summery =  `🗒️ *YOUR ORDER*: \n\n*${desserts}* \n\n💰 Total amount: *${
            total * 6
          },00 reais*. \n🚚 Delivery fee: R20. \n⏳ Delivery time: *50 minutes*. \n` +
                '🔊 ```The driver will come to fecth the money to pay the Resturants.```'

            //console.log(order_summery)

            await Whatsapp.sendSimpleButtons({
                message: order_summery,
                recipientPhone: from,
                listOfButtons: [
                    {
                        title: 'Finish order',
                        id:'finsh_order',
                    },
                    {
                        title:'Back',
                        id:'Back',
                    }, 
                    {
                        title:'cancel',
                        id:'cancel',
                    }, 
                
                ]
            })

        }else if(incomingMessage.button_reply.id=='cancel'){

            storage[from].stage = 0;
            storage[from].itens = [];


            await Whatsapp.sendSimpleButtons({
                message:"Molo "+recipientName+"! 🌟 \nHow can we assist you today? 🤔🛠️",
                recipientPhone: from,
                listOfButtons: [
                    {
                        title: 'Order food',
                        id:'Shopping',
                    },
                    {
                        title:'Errands',
                        id:'Errands',
                    }, 
                
                ]
            })

        }else if(incomingMessage.button_reply.id=='finsh_order'){

                storage[from].stage = 3;
                
                await Whatsapp.sendText({
                    message: "🗺️ Now enter the ADDRESS (Number, Street, Neighborhood)  🏠✉️🌍",
                    recipientPhone: from,
                });

        }else if(incomingMessage.button_reply.id=='Back'){


          console.log(incomingMessage.button_reply.id)

          const restaurantExists = await checkRestaurantExists(Thelastrelpy_id);

          console.log(restaurantExists)

           if(restaurantExists){

            console.log(restaurantExists)

                await Whatsapp.sendSimpleButtons({
                  message: "You want to",
                  recipientPhone: from,
                  listOfButtons: [
                      {
                          title: 'add another item',
                          id:'add_more',
                      },
              
                      {
                        title: 'view order',
                        id:'view_order',
                      },
                    {
                      title: 'cancel',
                      id:'cancel',
                  },
                    
                  ]
              })

              storage[from].stage = 2;


           }

        }
 
       // console.log(incomingMessage.button_reply.id)
    }

 

    
  },
};


const checkRestaurantExists = async (restaurantName) => {
    const restaurants = await fetchRestaurants();
  
    return restaurants.some(restaurant => {
      if (restaurant && restaurant.title) {
        return restaurant.title.toLowerCase() === restaurantName.toLowerCase();
      }
      return false;
    });
  };
  
