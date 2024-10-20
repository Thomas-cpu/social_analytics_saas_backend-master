"use strict";

import { stages, getStage } from "../utils/stages.js";
import { driver } from "../utils/driver.js";
import { menu } from "../utils/menu.js";
import { restaurants } from "../utils/restaurants.js";
import { getFieldValueFromFirestore } from "../utils/stages.js";
import { updateStageInFirestore,updateSdriverFirestore,updatestoreFirestore } from "../utils/stages.js";
import { doesDocumentExist } from "../utils/stages.js";
import { getdriverdetails } from "../utils/stages.js";
import { getStorageIDByDriver } from "../utils/stages.js";
import { db } from "../utils/firebase_config.js";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

import express from "express";
const router = express.Router();
import Store from "../utils/store.js";
var Store1 = new Store();
const CustomerSession = new Map();

var sendMessessage = false;

var clientnumber = ""

import WhatsappCloudAPI from "whatsappcloudapi_wrapper";
import { storage } from "../utils/storage.js";


function transformNumber(number) {
  // Convert the number to a string
  let numberStr = number.toString();
  
  // Remove the first two digits and add a '0' at the beginning
  let transformedNumber = '0' + numberStr.slice(2);
  
  return transformedNumber;
}

function getDescriptionById(object, id) {
  for (const location in object) {
    const products = object[location];
    const foundProduct = products.find((product) => product.id === id);

    if (foundProduct) {
      return foundProduct.description;
    }
  }

  return "Product not found"; // You can customize the message if the ID is not found
}

function generateRandomOrderNumber() {
  const timestamp = Date.now().toString(); // Get current timestamp as a string
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0"); // Generate a random 6-digit number
  // const orderNumber = `${timestamp}-${randomPart}`; // Combine timestamp and random number
  const orderNumber = `${randomPart}`;
  return orderNumber;
}

function updateStatusById(array, idToUpdate, newStatus) {
  array.forEach((item) => {
    if (item.id === idToUpdate) {
      item.status = newStatus;
      console.log("updated");
    }
  });
}

//////////////The best thing ever going to happened ///////////////////////

function findItemById(id) {
  for (const category in menu) {
    const items = menu[category];
    const foundItem = items.find((item) => item.id === id);
    if (foundItem) {
      return category;
    }
  }
  return null;
}


let number;


////////////////////////////////////////////////////////////////////////////////

let Whatsapp = new WhatsappCloudAPI({
  accessToken:
    "EAAYZCezh53gQBO4ZBFbiPEWNZCHF5fZB0SQJnNDY5SfvoF9fjBnjwUwuUgioqV8l0dik5h5Yjn66h4ZCJLjULgZAPhGkptxZCUuU3HklleMJzrz34BW2UxkOY9qiHpNO06gsvocCAYN7rDpmLGwiyLkIJJrylZBpPXEZAZCy2VfszEPO0hfrt1hK5lleFxoKqrPBJWygZDZD",
  senderPhoneNumberId: "412439775292455",
  WABA_ID: "455400624318333",
});

router.get("/callback", (req, res) => {
  try {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (
      mode &&
      token &&
      challenge &&
      mode === "subscribe" &&
      "setyourandomtoken" === token
    ) {
      console.log("Get: I am verified!");
      res.status(200).send(challenge);
    } else {
      console.log("Get: I am not verified!");
      res.status(403).send("Error, wrong token");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

function getDriverByNumber(phoneNumber) {
  for (const stoargeId in storage) {
    if (storage.hasOwnProperty(stoargeId)) {
      const currentDriver = storage[stoargeId];
      if (currentDriver.driver === phoneNumber && currentDriver.stage > 8) {
        return stoargeId;
      }
    }
  }
  return null;
}

// await Whatsapp.sendText({
//     message: 'This just testiing',
//     recipientPhone: '27614081190',
// });

router.post("/callback", async (req, res) => {
  try {
    let data = Whatsapp.parseMessage(req.body);

    let incomingMessage = data.message;

    if (data?.isMessage) {
      //let incomingMessage = data.message;

      let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
      let recipientName = incomingMessage.from.name;

      let typeOfMsg = incomingMessage.type;
      let message = "";
      if (typeOfMsg == "simple_button_message") {
        message = "Hi";
      } else if (typeOfMsg == "radio_button_message") {
        message = "Hi";
      } else {
        message = incomingMessage.text.body;
      }

      let message_id = incomingMessage.message_id;

      console.log(recipientPhone)

      console.log(restaurants[recipientPhone])

      if (!driver[recipientPhone] && !restaurants[recipientPhone]) {
        const fromData = { from: recipientPhone };

        getStage(fromData)
          .then((currentStage) => {
            console.log(currentStage);

            const messageResponse = stages[currentStage].stage.exec({
              from: recipientPhone,
              message: message,
              Whatsapp: Whatsapp,
              recipientName: recipientName,
              incomingMessage: incomingMessage,
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        if (incomingMessage.button_reply) {

          if(incomingMessage.button_reply.id.split('@')[1]=='query'){




                  // const updateParamsfordriver = {
                  //   from:  incomingMessage.button_reply.id.match(/\d+/)[0],
                  //   updatedFields: {
                  //     counterq: 1
                  //     // Add more fields as needed
                  //   },
                  // };
            
            
                  // updateSdriverFirestore(updateParamsfordriver)
                  // .then(async () => {


                    await Whatsapp.sendSimpleButtons({
                      message:
                          "Is the query resolved?",
                        recipientPhone: incomingMessage.button_reply.id.match(/\d+/)[0],
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

          
                  // });

               


          }




          doesDocumentExist(incomingMessage.button_reply.id.slice(0, 11))
            .then(async (exists) => {
              if (exists && !restaurants[recipientPhone]) {
                const fromData = {
                  from: incomingMessage.button_reply.id.slice(0, 11),
                };

                getStage(fromData)
                  .then(async (currentStage) => {

                    console.log("Current Stage:", currentStage);

                    // Check if the currentStage is 9 or 5
                    if (
                      (incomingMessage.button_reply.id.slice(12, 18) ==
                        "accept" &&
                        currentStage === 9) ||
                      currentStage === 5
                    ) {
                      var The_messeage;

                      var errands = await getFieldValueFromFirestore(
                        number,
                        "errands"
                      );

                      var address = await getFieldValueFromFirestore(
                        number,
                        "address"
                      );

                      var getcurrentdriver = await getFieldValueFromFirestore(
                        number,
                        "driver"
                      );


                        if(getcurrentdriver=="" || getcurrentdriver==recipientPhone){
                             

                          if (currentStage === 9) {
                            The_messeage =
                              "New Delivery Request 🔔"+
                              "\n\nADDRESS : " +
                              address +
                              "\n\nCustomer no: "+transformNumber(number);
                          } else if (currentStage == 5) {
                            var items = await getFieldValueFromFirestore(
                              number,
                              "items"
                            );
    
                            const totalPrice = items.reduce((total, item) => {
                              const itemPrice = Number(item.price.replace("R", ""));
    
                              return total + itemPrice;
                            }, 0);
    
                            The_messeage =
                              "Order Request\n\n" +
                              "REQUEST : " +
                              errands +
                              "\n\nADDRESS : " +
                              address +
                              "\n\nDelivery Fee: R20 && Resturant Fee: " +
                              totalPrice;
                          }



                          console.log("sending order to the driver");


                          const updateParamsfordriver = {
                            from:  incomingMessage.from.phone,
                            updatedFields: {
                              onroute: "on route to client "+incomingMessage.button_reply.id.slice(0, 11)
                              // Add more fields as needed
                            },
                          };


                          updateSdriverFirestore(updateParamsfordriver)
                           .then(async () => {



                           });



    
                          const updateParams = {
                            from: incomingMessage.button_reply.id.slice(0, 11),
                            updatedFields: {
                              stage: 9,
                              driver: incomingMessage.from.phone,
                              // Add more fields as needed
                            },
                          };
    
                          updateStageInFirestore(updateParams)
                          .then(async () => {
                            await Whatsapp.sendText({
                              message: The_messeage,
                              recipientPhone: incomingMessage.from.phone,
                            });
  
                            await Whatsapp.sendSimpleButtons({
                              message: "Have you arrived at " + address,
                              recipientPhone: incomingMessage.from.phone,
                              listOfButtons: [
                                {
                                  title: "Yes I have arrived",
                                  id: "DriverArrived",
                                },
                              ],
                            });
                          })
                          .catch((error) => {
                            console.error("Error:", error);
                          });


                          var errands = await getFieldValueFromFirestore(
                            incomingMessage.button_reply.id.slice(0, 11),
                            "errands"
                          );

                          var type = await getFieldValueFromFirestore(
                            incomingMessage.button_reply.id.slice(0, 11),
                            "type"
                          );
    
                          var address = await getFieldValueFromFirestore(
                            incomingMessage.button_reply.id.slice(0, 11),
                            "address"
                          );
    
                          var drivername = await getdriverdetails(
                            incomingMessage.from.phone,
                            "name"
                          );


                          
                      const randomOrderNumber = generateRandomOrderNumber();


                      db.collection("Orders")
                        .doc(randomOrderNumber)
                        .set({
                          Order_No: randomOrderNumber,
                          Driver: drivername,
                          client: incomingMessage.button_reply.id.slice(0, 11),
                          type: type,
                          item: errands,
                          drop: errands,
                          destination: address,
                          status: "Driver going to client",
                          time: Timestamp.now(),
                          query:"No query",
                          queryR:"N/A",
                          queryCounter:0
                        })
                        .then(() => {
                          //console.log("Yes"); // Print 'Yes' when the document is successfully added
                        })
                        .catch((error) => {
                          console.error(
                            "Error adding document to Firestore:",
                            error
                          );
                        });

                        

                         var order_no = await getFieldValueFromFirestore(incomingMessage.button_reply.id.slice(0, 11), "order_no");

                          if(order_no){

                            randomOrderNumber = order_no;

                          }else{

                              var updatesomestuff = {
                                from: incomingMessage.button_reply.id.slice(0, 11),
                                updatedFields: {
                                  order_no: randomOrderNumber,
                                  
                                },
                              };

                              
                            updateStageInFirestore(updatesomestuff)
                            .then(async () => {

                              await Whatsapp.sendText({
                                message:
                                  "Your orderNo#" +
                                  randomOrderNumber +
                                  " 🚗 Your driver is " +
                                  drivername +
                                  " and he is on his way to you!",
                                recipientPhone: incomingMessage.button_reply.id.slice(
                                  0,
                                  11
                                ),
                              });

                            })
    
                            .catch((error) => {
                              console.error("Error:", error);
                            });
                        

                          }
                      
  
                             
                        }else{

                            await Whatsapp.sendText({
                              message:"Sorry this trip has been taken by another driver",
                              recipientPhone: incomingMessage.from.phone,
                            });
                          
                        }

                    } 
                    
                    else {
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });

                number = incomingMessage.button_reply.id.slice(0, 11);

               

                var driver = await getFieldValueFromFirestore(number, "driver");

                


                if (driver.trim() !== "" || driver.trim()==="") {

                  const fromData = { from: number };

                  console.log("The driver is:" ,driver)

                  getStage(fromData)
                    .then(async (currentStage) => {


                      if (currentStage == 4) {

                        await Whatsapp.sendText({
                          message: 'Now wait for the order to be finished by restaurant you will be notified when to fetch it',
                          recipientPhone: recipientPhone,

                         }); 
                        

                         

                        const updateParams = {
                          from: number,
                          updatedFields: {
                            driver: recipientPhone,
                          },
                        };

                        updateStageInFirestore(updateParams)
                          .then(async () => {
                            
                            const messageResponse = stages[17].stage.exec({
                              from: number,
                              message: message,
                              Whatsapp: Whatsapp,
                              recipientName: recipientName,
                              incomingMessage: incomingMessage,
                            });

                          })
                          
                          .catch((error) => {
                            console.error("Error:", error);
                          });
                      }

                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });

                  console.log("The best here");
                } else {
                }

                // Add your logic for when the document exists
              } else {

                const driverValueToSearch = recipientPhone;

                //let number = incomingMessage.button_reply.id.slice(0, 11);

                console.log("This is the recipient", number)

                var order_no = await getFieldValueFromFirestore(number, "order_no");  

                console.log("This is the order number", order_no)

                try {
                  const storageID = await getStorageIDByDriver(
                    driverValueToSearch,order_no);

                  if (storageID !== null) {
                    console.log(
                      `StorageID for driver ${driverValueToSearch}: ${storageID}`
                    );

                    const customernumber = storageID;

                    const fromData = { from: customernumber };

                    getStage(fromData)
                      .then((currentStage) => {
                        console.log(currentStage);

                        // const currentStage = getStage({ from: customernumber});

                        const messageResponse = stages[currentStage].stage.exec(
                          {
                            from: recipientPhone,
                            message: message,
                            Whatsapp: Whatsapp,
                            recipientName: recipientName,
                            incomingMessage: incomingMessage,
                            customer: customernumber,
                          }
                        );
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                  } else {
                    console.log(
                      `No document found for driver ${driverValueToSearch}.`
                    );
                  }
                } catch (error) {
                  console.error("Error:", error);
                }

                console.log(`Document with ID does not exist in Firestore.`);
                // Add your logic for when the document does not exist
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }else{

          if(sendMessessage==true){


            await Whatsapp.sendText({
              message:incomingMessage.text.body,
              recipientPhone: clientnumber,
            });


            await Whatsapp.sendText({
              message:incomingMessage.text.body,
              recipientPhone: '27716880654',
            });


            sendMessessage =false;

            clientnumber="";

            sendMessessage = false;

          }else{


            //! && !restaurants[recipientPhone]
            const updateParams = {
              from: incomingMessage.from.phone,
              updatedFields: {
                status: "online",
                // Add more fields as needed
              },
            };


            if(driver[recipientPhone]){

              updateSdriverFirestore(updateParams)
              .then(async () => {
  
                await Whatsapp.sendText({
  
                  message:"You are now online ready to receive clients orders",
                  recipientPhone: incomingMessage.from.phone,
      
                });
  
              })
  

            }else{


              updatestoreFirestore(updateParams)
              .then(async () => {
  
                await Whatsapp.sendText({
  
                  message:"You are now online ready to receive clients orders",
                  recipientPhone: incomingMessage.from.phone,
      
                });
  
              })


            }

          



    
          
          }
            
        

        }
      }

      //  resturant   part

      if (restaurants[recipientPhone]) {

        if (restaurants[recipientPhone].status == "offline") {
          console.log(
            "The driver number is",
            restaurants[recipientPhone].status
          );

          const userDocRef = db.collection("restaurant").doc(recipientPhone);

          // Use the update method to update specific fields of the document
          userDocRef
            .update({
              status: "online",
            })

            .then(async () => {


              // await Whatsapp.sendText({
              //   message:
              //     "Hi " +
              //     recipientName +
              //     " You are now online ready to receive orders",
              //   recipientPhone: recipientPhone,
              // });



              console.log("Document updated successfully.");
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        }

        if (incomingMessage.button_reply) {
          console.log("The best thing ever");

          const fromData = {
            from: incomingMessage.button_reply.id.split("@")[0],
          };

          getStage(fromData)
            .then(async (currentStage) => {

              if (currentStage == 4) {

                const afterAt = incomingMessage.button_reply.id.split("@")[1];

                const result = afterAt.split("&")[0];

                if (incomingMessage.button_reply.id.match(/accept/)) {
                  //  storage[].stage = 5;

                  const updateParams = {
                    from: incomingMessage.button_reply.id.split("@")[0],
                    updatedFields: {
                      stage: 5,
                    },
                  };

                  updateStageInFirestore(updateParams)
                    .then(async () => {

                      var items = await getFieldValueFromFirestore(
                        incomingMessage.button_reply.id.split("@")[0],
                        "items"
                      );

                      updateStatusById(items, result, "Accepted");

                      var order_number = await getFieldValueFromFirestore(incomingMessage.button_reply.id.split("@")[0], "order_no");

                      await Whatsapp.sendText({
                        message:
                          "Hi Your order #" +
                          order_number +
                          " Has been accepted and is being prepared",
                        recipientPhone: incomingMessage.button_reply.id.split(
                          "@"
                        )[0],
                      });

                      await Whatsapp.sendSimpleButtons({
                        message:
                          "Hi is order #" +order_number
                          +
                          " complete ?",
                        recipientPhone: recipientPhone,
                        listOfButtons: [
                          {
                            title: "Yes",
                            id: incomingMessage.button_reply.id,
                          },
                        ],
                      });
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });

                  //*///////
                } else if (incomingMessage.button_reply.id.match(/reject/)) {


                  var items = await getFieldValueFromFirestore(
                    incomingMessage.button_reply.id.split("@")[0],
                    "items"
                  );

                  var Order_No = await getFieldValueFromFirestore(
                    incomingMessage.button_reply.id.split("@")[0],
                    "order_no"
                  );

                  var driver = await getFieldValueFromFirestore(
                    incomingMessage.button_reply.id.split("@")[0],
                    "driver"
                  );

                  var admin = await getFieldValueFromFirestore(
                    incomingMessage.button_reply.id.split("@")[0],
                    "admin"
                  );

                  updateStatusById(items, result, "rejected");

                  await Whatsapp.sendText({
                    message:
                      "Hi Your #"+Order_No+" order Has been rejected",
                    recipientPhone: incomingMessage.button_reply.id.split(
                      "@"
                    )[0],
                  });


                  await Whatsapp.sendText({
                    message:
                      "Hi #"+Order_No+" order has been reject/canceled",
                    recipientPhone: driver,
                  });


                   await Whatsapp.sendText({
                    message:
                      "Hi #"+Order_No+" order Has been reject/canceled",
                    recipientPhone: admin,
                  });


                    
                const updateParams = {
                  from: incomingMessage.button_reply.id.split(
                    "@"
                  )[0],
                  updatedFields: {
                   stage: 1,
                   order_sent:"No",
                   order_no :"",
                   items:[],
                   admin:"27716880654",

                  },
                };
                

                updateStageInFirestore(updateParams)
                  .then(async () => {
                    try {

                      sendMessessage = true;

                      clientnumber = incomingMessage.button_reply.id.split(
                        "@"
                      )[0]

                      
                      await Whatsapp.sendText({
                        message:
                          "Please state your reason for rejecting the order ",
                        recipientPhone: recipientPhone,
                      });

                    } catch (error) {
                      console.error("Error in initialStage.exec:", error);
                      // Handle the error as needed, such as logging, sending a response, etc.
                    }
                  })


        

                }
              } else {
                if (incomingMessage.button_reply) {
                  const fromData = {
                    from: incomingMessage.button_reply.id.split("@")[0],
                  };

                  getStage(fromData)
                    .then((currentStage) => {
                      const customernumber = getDriverByNumber(recipientPhone);

                      const messageResponse = stages[currentStage].stage.exec({
                        from: recipientPhone,
                        message: message,
                        Whatsapp: Whatsapp,
                        recipientName: recipientName,
                        incomingMessage: incomingMessage,
                      });
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                }
              }

              // const currentStage = getStage({ from: customernumber});
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    }
    res.status(200).send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);

    console.log("King");
  }
});

export default router;
