import { menu } from '../menu.js';
import { db } from '../firebase_config.js';
import { getFieldValueFromFirestore } from "../stages.js";
import { updateStageInFirestore } from "../stages.js";


function reduceString(str) {
  // Check if the string length is greater than 20
  if (str.length > 20) {
    // If so, return the first 20 characters of the string
    return str.slice(0, 20);
  } else {
    // Otherwise, return the string as is
    return str;
  }
}

function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

var page =1 ;

var previous_page = 1;

var previouspage = 1;

var maxpage;




const fetchRestaurants = async () => {
  try {
    const snapshot = await restaurantsCollection
      .where("status", "==", "online")
      //.limit(9)
      .get();

    let index = 1; // Initialize the index counter

    return snapshot.docs.map((doc) => ({
      title: reduceString(doc.data().name),
      description: reduceStringD(doc.data().description),
      id: doc.data().name,
      
    }));

  } catch (error) {
    console.error("Error fetching online restaurant data from Firestore:", error);
    throw error;
  }
};


async function getMenu(pageNumber, pageSize, objectArray) {
  const startIndex = (pageNumber - 1) * pageSize;
  const totalItems = objectArray.length;
  const maxPage = Math.ceil(totalItems / pageSize);

  if (pageNumber < 1 || pageNumber > maxPage) {
    console.log(`Page ${pageNumber} does not exist. Please select a valid page.`);
    return [];
  }
  
  let endIndex = startIndex + pageSize;
  if (endIndex > totalItems) {
    endIndex = totalItems; // Set endIndex to totalItems if it exceeds the total number of items
  }

  return {
    data: objectArray.slice(startIndex, endIndex),
    maxPage: maxPage,
    totalItems: totalItems // Add totalItems as an attribute
  };
}



async function getPage(pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  const restaurantData = await fetchRestaurants();
  const totalItems = restaurantData.length;
  const maxPage = Math.ceil(totalItems / pageSize);

  if (pageNumber < 1 || pageNumber > maxPage) {
    console.log(`Page ${pageNumber} does not exist. Please select a valid page.`);
    return [];
  }
  
  let endIndex = startIndex + pageSize;
  if (endIndex > totalItems) {
    endIndex = totalItems; // Set endIndex to totalItems if it exceeds the total number of items
  }

  return {
    data: restaurantData.slice(startIndex, endIndex),
    maxPage: maxPage
  };
}




function reduceStringD(str) {
  // Check if the string length is greater than 20
  if (str.length > 70) {
    // If so, return the first 20 characters of the string
    return str.slice(0, 70);
  } else {
    // Otherwise, return the string as is
    return str;
  }
}




var Thelastrelpy_id;

// Assume you have a 'restaurants' collection in Firestore
const restaurantsCollection = db.collection('restaurant');

export const stageTwo = {

  async exec({ from,incomingMessage,message,Whatsapp,recipientName }) {

    if(incomingMessage.list_reply){

      var restaurant  = await getFieldValueFromFirestore(from, "Restaurant");


        if(incomingMessage.list_reply.id!="Other"){


          if(!isNumber(incomingMessage.list_reply.id)){

            if(!restaurant){
              
              const updateParams = {
                from: from,
                updatedFields: {
                  Restaurant: incomingMessage.list_reply.id,
                },
              };

              updateStageInFirestore(updateParams)
                .then(async () => {

            
                })
                .catch((error) => {
                  console.error("Error:", error);
                });


            } 
        

            const restaurantExists = await checkRestaurantExists(incomingMessage.list_reply.id);

            if(restaurantExists){
        
                const menuItems = menu[incomingMessage.list_reply.id];


                const updateParams = {
                  from: from,
                  updatedFields: {
                    Restaurant: incomingMessage.list_reply.id,
                  },
                };
      
                updateStageInFirestore(updateParams)
                .then(async () => {
                  try {
               
                    } catch (error) {
                    console.error("Error in initialStage.exec:", error);
                    // Handle the error as needed, such as logging, sending a response, etc.
                  }
                })
        


                if(menuItems){


        
                  const transformedItems = menuItems.map(item => {
                    return {
                      title: reduceString(item.title),
                      description: reduceStringD(item.description),
                      id: item.id
                    };
        
                  });


                  getMenu(1, 9,transformedItems).then(async page1 => {

                  
                    await Whatsapp.sendRadioButtons({
                    
                      recipientPhone: from,
                      headerText: 'Food Menu',
                      bodyText:
                          'Pick one product at a time',
                      footerText: 'Approved by Cloudy Deliveries',
                      listOfSections: [
                          {
                              title: 'Food Menu',
                              rows: page1.data,
                          },
          
                      ],
                  });
                    console.log(page1.data)
  
                  });
        
        
                }else{
        
                          await Whatsapp.sendText({
                            message:
                              "The Menu for this Resturant has not be added yet",
                            recipientPhone: from,
                          });
                
                          const updateParams = {
                            from: from,
                            updatedFields: {
                              rating: 1,
                            },
                          };
                
                          updateStageInFirestore(updateParams)
                          .then(async () => {
                            try {
                         
                              } catch (error) {
                              console.error("Error in initialStage.exec:", error);
                              // Handle the error as needed, such as logging, sending a response, etc.
                            }
                          })

                          const restaurantData = await fetchRestaurants();

                          
                          getPage(page, 3).then(async page1 => {

                                
                            page1.data.push({
                            title: "More Restaurants",
                            description: "More Restaurants",
                            id: page
                          });

                          previouspage = previous_page-1;

                          // page1.data.push({
                          //   title: "Go back",
                          //   description: "Go back to page "+previouspage,
                          //   id: previouspage
                          // });


                          await Whatsapp.sendRadioButtons({
                            recipientPhone: from,
                            headerText: "Select the restaurant you want",
                            bodyText: "All restaurants on this app are trusted brands",
                            footerText: "Approved by Cloudy Deliveries",
                    
                            listOfSections: [
                              {
                                title: "Top Restaurants",
                                rows: page1.data,
                              },
                            ],

                          });


                        });

                          previous_page = page;
                          page = page+1;

                         
                          ///end///
        
      
                }
        
            }


           }else{

               var pageon = await getFieldValueFromFirestore(from, "pageon")
          
                if(pageon==1){

              
                  const updateParams = {
                    from: from,
                    updatedFields: {
                      stage: 2,
                      pageon:2
                  
                    },
                  };
          
                  updateStageInFirestore(updateParams)
                  .then(async () => {


                    getPage(2, 3).then(async page1 => {

                  
                      page1.data.push({
                      title: "More Restaurants",
                      description: "More Restaurants",
                      id: 3
                    });
      
                    previouspage = previous_page-1;
      
                    // page1.data.push({
                    //   title: "Go back",
                    //   description: "Go back to page 1",
                    //   id: 1
                    // });
      
                    console.log(page1.data)
              
      
                    await Whatsapp.sendRadioButtons({
                      recipientPhone: from,
                      headerText: "Select the restaurant you want",
                      bodyText: "All restaurants on this app are trusted brands",
                      footerText: "Approved by Cloudy Deliveries",
              
                      listOfSections: [
                        {
                          title: "Top Restaurants",
                          rows: page1.data,
                        },
                      ],
                    });
      
                    
      
                  });
      
                  previous_page = 1;
                  previouspage = 1;
                  page = 3;


                })


    
                }



           }


        }else{


          const updateParams = {
            from: from,
            updatedFields: {
              stage: 7,
              // Add more fields as needed
            },
          };
  
          updateStageInFirestore(updateParams)
            .then(async () => {
              await Whatsapp.sendSimpleButtons({
                message: "Please type out your address or descripion of where we will find you📍",
                recipientPhone: from,
                listOfButtons: [
                  {
                    title: "Cancel",
                    id: "Cancel",
                  },
                ],
              });
  
              // Stage updated successfully
            })
            .catch((error) => {
              console.error("Error:", error);
            });
  

      }

      var resturant = await getFieldValueFromFirestore(from, "Restaurant");


      const menuItems = menu[resturant];

        if(menuItems){
 
          if(menuItems.find(item => item.id === incomingMessage.list_reply.id)){

            var items = await getFieldValueFromFirestore(from, "items");

            const updatedItems = items.concat(menuItems.find(item => item.id === incomingMessage.list_reply.id));

           
          if(updatedItems){

          const updateParams = {
            from: from,
            updatedFields: {
              stage: 2,
              items: updatedItems
              // Add more fields as needed
            },
          };

        updateStageInFirestore(updateParams)
        .then(async () => {
          try {

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
                  id:'Cancel',
              },
                
              ]
          })
         
          } catch (error) {
            console.error("Error in initialStage.exec:", error);
            // Handle the error as needed, such as logging, sending a response, etc.
          }
        })

        
         }


        }

        }


        if(page >previous_page  && incomingMessage.list_reply.id==page){


         if(page==maxpage ){



              getPage(page, 3).then(async page1 => {

                
                page1.data.push({
                title: "Last Page",
                description: "You are in page "+previous_page,
                id: page
              });

              previouspage = previous_page-1;

              page1.data.push({
                title: "Go back",
                description: "Go back to page "+previouspage,
                id: previouspage
              });

        

              await Whatsapp.sendRadioButtons({
                recipientPhone: from,
                headerText: "Select the restaurant you want",
                bodyText: "All restaurants on this app are trusted brands",
                footerText: "Approved by Cloudy Deliveries",
        
                listOfSections: [
                  {
                    title: "Top Restaurants",
                    rows: page1.data,
                  },
                ],
              });

              

            });

            previous_page = page;
            page = page+1;

         }else{

       ///////////////

          getPage(page, 3).then(async page1 => {

                
            page1.data.push({
            title: "More Restaurants",
            description: "More Restaurants",
            id: page
          });

          previouspage = previous_page-1;

          // page1.data.push({
          //   title: "Go back",
          //   description: "Go back to page "+previouspage,
          //   id: previouspage
          // });


          await Whatsapp.sendRadioButtons({
            recipientPhone: from,
            headerText: "Select the restaurant you want",
            bodyText: "All restaurants on this app are trusted brands",
            footerText: "Approved by Cloudy Deliveries",
    
            listOfSections: [
              {
                title: "Top Restaurants",
                rows: page1.data,
              },
            ],

          });


        });

          previous_page = page;
          page = page+1;

         }

  /////////////////////
          
        }else if(incomingMessage.list_reply.id==previouspage){

  
          previouspage = previous_page-1;

          getPage(previouspage, 3).then(async page1 => {

           
            page = previous_page;

            previous_page = previouspage;

            previouspage = previouspage-1;
   
            page1.data.push({

            title: "More Restaurants",
            description: "More Restaurants",
            id: page

          });

          

          if(previouspage!=0){


            // page1.data.push({
            //   title: "Go back",
            //   description: "Go back to page "+previouspage,
            //   id: previouspage
            // });

          }

          

          await Whatsapp.sendRadioButtons({
            recipientPhone: from,
            headerText: "Select the restaurant you want",
            bodyText: "All restaurants on this app are trusted brands",
            footerText: "Approved by Cloudy Deliveries",
    
            listOfSections: [
              {
                title: "Top Restaurants",
                rows: page1.data,
              },
            ],
          });


        });
   


    }


        
    }else if(!incomingMessage.button_reply){



      const restaurantData = await fetchRestaurants();



      const updateParams = {
        from: from,
        updatedFields: {
          rating: 1,
        },
      };
  
      updateStageInFirestore(updateParams)
        .then(async () => {

         // const fieldName = "errands";

  
            await Whatsapp.sendSimpleButtons({
            message:
              "Do you want to ?",
            recipientPhone: from,
            listOfButtons: [
              {
                title: "Continue Order",
                id: "Continue",
              },
              {
                title: "Cancel",
                id: "Cancel",
              },
            ],
          });
  
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  


    }


    if(incomingMessage.button_reply){


      var restaurant = await getFieldValueFromFirestore(from, "Restaurant");


      const restaurantExists = await checkRestaurantExists(restaurant);

        if(incomingMessage.button_reply.id=='add_more'){

            if(restaurantExists){

              const menuItems = menu[restaurant];



                const transformedItems = menuItems.map(item => {
                    return {
                      title:reduceString(item.title),
                      description: reduceStringD(item.description),
                      id: item.id
                    };
                  });


                  getMenu(1, 9,transformedItems).then(async page1 => {

                  
                    await Whatsapp.sendRadioButtons({
                    
                      recipientPhone: from,
                      headerText: 'Food Menu',
                      bodyText:
                          'Pick one product at a time',
                      footerText: 'Approved by Cloudy Deliveries',
                      listOfSections: [
                          {
                              title: 'Food Menu',
                              rows: page1.data,
                          },
          
                      ],
                  });
                    console.log(page1.data)
  
                  });

                
            }

         
        }else if(incomingMessage.button_reply.id=='view_order'){

            let desserts = '';

           var items = await getFieldValueFromFirestore(from, "items");

            items.map((item, index) => {
              if (index == items.length - 1) {
                desserts += index+'-'+item.description + '.';
              } else {
                desserts += index+'-'+item.description + '\n';
              }
            });

          // const total = items.length;

          var restaurant  = await getFieldValueFromFirestore(from, "Restaurant");


           const totalPrice = items.reduce((total, item) => {
                        // Extract the numeric part of the price and convert it to a number
                        const itemPrice = Number(item.price.replace('R', ''));
                        
                        // Add the current item's price to the total
                        return total + itemPrice;
                      }, 0);

           const order_summery =  `🗒️ *YOUR ORDER*: \n\n*${desserts}* \n\n💰 Total amount: *${
            totalPrice
          },00*. \n🚚 Delivery fee: R20. \n🏡 Restaurants: ${restaurant} \n⏳ Delivery time: *50 minutes*. \n` +
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
                        id:'Cancel',
                    }, 
                
                ]
            })

        }else if(incomingMessage.button_reply.id=='Cancel'){

          const updateParams = {
            from: from,
            updatedFields: {
              stage: 1,
              items: [],
              order_no :"",
              errands:"",
              admin:"27716880654",
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
  
             

            })
            .catch((error) => {
              console.error("Error:", error);
            });
         




        }else if(incomingMessage.button_reply.id=='finsh_order'){


        const updateParams = {
          from: from,
          updatedFields: {
            stage: 3,
            errands:"Food order"
            // Add more fields as needed
          },
        };
      
        updateStageInFirestore(updateParams)
          .then(async () => {

           // storage[from].errands = message;
  
              await Whatsapp.sendSimpleButtons({
                message: "Please type out your address or descripion of where we will find you📍",
                recipientPhone: from,
                listOfButtons: [
                    {
                        title: 'Cancel',
                        id:'Cancel',
                    },

                  
                ]
            })
  
           
          })
          .catch((error) => {
            console.error('Error:', error);
          });

                
                
                
        }else if(incomingMessage.button_reply.id=='Back'){


          console.log(incomingMessage.button_reply.id)

          var resturant = await getFieldValueFromFirestore(from, "Restaurant");


          const restaurantExists = await checkRestaurantExists(resturant);

          console.log(restaurantExists)

           if(restaurantExists){


            const updateParams = {
              from: from,
              updatedFields: {
                stage: 2,
        
                // Add more fields as needed
              },
            };
    
            updateStageInFirestore(updateParams)
              .then(async () => {
                // Stage updated successfully


                
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
                      id:'Cancel',
                  },
                    
                  ]
              })
    
            



              })
              .catch((error) => {
                console.error("Error:", error);
              });
           
 
           }

        }else if(incomingMessage.button_reply.id=='Continue'){

          const restaurantData = await fetchRestaurants();

                      
           if(restaurantData.length>9){


                page =1 ;

                previous_page = 1;
                  
                previouspage = 1;
                  
                maxpage;

              

                getPage(page, 3).then(async page1 => {


                   page1.data.push({
                    title: "More Restaurants",
                    description: "More Restaurants",
                    id: page
                  });

            

                  await Whatsapp.sendRadioButtons({
                    recipientPhone: from,
                    headerText: "Select the restaurant you want",
                    bodyText: "All restaurants on this app are trusted brands",
                    footerText: "Approved by Cloudy Deliveries",
            
                    listOfSections: [
                      {
                        title: "Top Restaurants",
                        rows: page1.data,
                      },
                    ],
                  });

                  maxpage = page1.maxPage


                });

                page = page+1;

            

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
  
