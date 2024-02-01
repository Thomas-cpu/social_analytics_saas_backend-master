"use strict";

import { stages, getStage } from "../utils/stages.js";
import { driver } from "../utils/driver.js";
import { menu } from "../utils/menu.js";
import { restaurants } from "../utils/restaurants.js";
import { getFieldValueFromFirestore } from "../utils/stages.js";
import { updateStageInFirestore } from "../utils/stages.js";
import { doesDocumentExist } from "../utils/stages.js";
import { getdriverdetails } from "../utils/stages.js";
import { getStorageIDByDriver } from "../utils/stages.js";
import { db } from "../utils/firebase_config.js";

import express from "express";
const router = express.Router();
import Store from "../utils/store.js";
var Store1 = new Store();
const CustomerSession = new Map();

import WhatsappCloudAPI from "whatsappcloudapi_wrapper";
import { storage } from "../utils/storage.js";

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
    "EABRU3YnVXC0BO4HjZAqlPwgnIDTFNXAtmFpfoxGJJ7BKij836aHKCjr1kLT6hooyrfynLoanNA2psbRLFcQGC6YIJHzSfIXQEVWu6Jfx8znYkHRAZAdHyS8bangJZB9yJ7qaqL3l7Im5jGDAqa0nNW8qaDC8yoBdbjhqVIVZChMRF4vgugNX13kx69eICu0YnZBjby71oz3anOk7eX1bg",
  senderPhoneNumberId: "107594839093339",
  WABA_ID: "112423675271755",
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

                      console.log(getcurrentdriver)

                        if(getcurrentdriver==""){
                             

                          if (currentStage === 9) {
                            The_messeage =
                              "Request Summery\n\n" +
                              "REQUEST : " +
                              errands +
                              "\n\nADDRESS : " +
                              address +
                              "";
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
                              "Food Order Request\n\n" +
                              "REQUEST : " +
                              errands +
                              "\n\nADDRESS : " +
                              address +
                              "\n\nDelivery Fee: R20 && Resturant Fee: " +
                              totalPrice;
                          }


                          //console.log(incomingMessage.from.phone);

                          console.log("sending order to the driver");

                          console.log( )
    
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
                          type: "Errands",
                          item: errands,
                          drop: errands,
                          destination: address,
                          status: "Driver going to client",
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

                if (driver.trim() === "") {

                

                  const fromData = { from: number };

                  getStage(fromData)
                    .then((currentStage) => {
                      if (currentStage == 4) {
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

            
          await Whatsapp.sendText({

            message:"You are now online ready to receive clients orders",
            recipientPhone: incomingMessage.from.phone,

          });

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
              await Whatsapp.sendText({
                message:
                  "Hi " +
                  recipientName +
                  " You are now online ready to receive orders",
                recipientPhone: recipientPhone,
              });

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

                      await Whatsapp.sendText({
                        message:
                          "Hi Your order " +
                          getDescriptionById(menu, result) +
                          " Has been accepted and is being prepared",
                        recipientPhone: incomingMessage.button_reply.id.split(
                          "@"
                        )[0],
                      });

                      await Whatsapp.sendSimpleButtons({
                        message:
                          "Hi is order " +
                          getDescriptionById(menu, result) +
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
                  updateStatusById(
                    storage[incomingMessage.button_reply.id.split("@")[0]]
                      .itens,
                    result,
                    "Reject"
                  );

                  await Whatsapp.sendText({
                    message:
                      "Hi Your order " +
                      getDescriptionById(menu, result) +
                      " Has been rejected",
                    recipientPhone: incomingMessage.button_reply.id.split(
                      "@"
                    )[0],
                  });
                }
              } else {
                if (incomingMessage.button_reply) {
                  const fromData = {
                    from: incomingMessage.button_reply.id.split("@")[0],
                  };

                  getStage(fromData)
                    .then((currentStage) => {
                      const customernumber = getDriverByNumber(recipientPhone);
                      //== const currentStage = getStage({ from: incomingMessage.button_reply.id.split('@')[0]});

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
