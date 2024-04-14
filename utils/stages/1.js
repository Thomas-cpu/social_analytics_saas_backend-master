import { db } from "../firebase_config.js";
import { updateStageInFirestore } from "../stages.js";

const restaurantsCollection = db.collection("restaurant");

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

var page =1 ;

var previous_page = 1;

var previouspage = 1;

var maxpage;


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


const fetchRestaurants = async () => {
  try {
    const snapshot = await restaurantsCollection
      .where("status", "==", "online")
      .limit(9)
      .get();

      return snapshot.docs.map((doc) => ({
        title: reduceString(doc.data().name),
        description: reduceStringD(doc.data().description),
        id: doc.data().name,

      }));

  } catch (error) {
    console.error(
      "Error fetching online restaurant data from Firestore:",
      error
    );
    throw error;
  }
};


const length_of_resturant = async () => {
  try {
    const snapshot = await restaurantsCollection
      .where("status", "==", "online")
      .limit(9)
      .get();

      return snapshot.docs.map((doc) => ({
        title: reduceString(doc.data().name),
        description: reduceStringD(doc.data().description),
        id: doc.data().name,

      }));

  } catch (error) {
    console.error(
      "Error fetching online restaurant data from Firestore:",
      error
    );
    throw error;
  }
};


////////////////////////////////////////////////

export const stageOne = {
  async exec({ from, incomingMessage, Whatsapp, recipientName }) {
    if (incomingMessage.button_reply) {
      if (incomingMessage.button_reply.id === "Shopping") {

        const updateParams = {
          from: from,
          updatedFields: {
            stage: 2,
            pageon: 1
            // Add more fields as needed
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {
            // Fetch restaurant data and replace existing rows
            const restaurantData = await fetchRestaurants();


             console.log(restaurantData.length);

            if (restaurantData.length === 0) {

             // console.log("The best thing ever");

              await Whatsapp.sendSimpleButtons({
                message:
                  "Hi unfortunately there are no resturants available at moment please try again in 10 minutes",
                recipientPhone: from,
                listOfButtons: [
                  {
                    title: "Request Delivery",
                    id: "Errands",
                  },
               
                ],
              });

        
              const updateParams = {
                from: from,
                updatedFields: {
                  stage: 1,
                },
              };

              updateStageInFirestore(updateParams)
              .then(async () => {
                try {
                  console.log("good");
                   } catch (error) {
                  console.error("Error in initialStage.exec:", error);
                  // Handle the error as needed, such as logging, sending a response, etc.
                }
              })
      
              .catch((error) => {
                console.error("Error:", error);
              });




            } else {


              page =1 ;

              previous_page = 1;
              
              previouspage = 1;
              
              maxpage;
        
                
        
                  getPage(page, 8).then(async page1 => {
        
        
                    // console.log("Page 1:", page1);
        
        
                     page1.data.push({
                      title: "Got to page "+page,
                      description: "You are in page "+previous_page,
                      id: page
                    });
        
              
        
                    await Whatsapp.sendRadioButtons({
                      recipientPhone: from,
                      headerText: "Select the restaurant you want",
                      bodyText: "All restaurants on this app are trusted brands",
                      footerText: "Approved by Cloudy Delivery",
              
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

            // Stage updated successfully
          })
          .catch((error) => {
            console.error("Error:", error);
          });
          
      } else if (incomingMessage.button_reply.id === "Errands") {


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
    } else {



      
      const updateParams = {
        from: from,
        updatedFields: {
          stage: 1,
          order_sent:"No"
          // Add more fields as needed
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          try {
            //storage[from].stage = 1;

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


          } catch (error) {
            console.error("Error in initialStage.exec:", error);
            // Handle the error as needed, such as logging, sending a response, etc.
          }
        })

        .catch((error) => {
          console.error("Error:", error);
        });


    }
  },
};
