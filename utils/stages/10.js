import { storage } from "../storage.js";
import { updateDocument } from "../firebase_config.js";
import { updateStageInFirestore } from "../stages.js";

import { getFieldValueFromFirestore } from "../stages.js";

export const stageten = {
  async exec({ from, Whatsapp, customer, incomingMessage }) {
    if (incomingMessage.button_reply) {
      if (incomingMessage.button_reply.id === "arrievedatlocation") {
        var order = await getFieldValueFromFirestore(customer, "order_no");

        const fieldsToUpdate = {
          status:
            "The driver has arrived at the location of the client errant/order location!",
          // Add more fields as needed
        };

        updateDocument("Orders", order, fieldsToUpdate);

        const updateParams = {
          from: customer,
          updatedFields: {
            stage: 11,
          },
        };

        updateStageInFirestore(updateParams)
          .then(async () => {
 
            await Whatsapp.sendSimpleButtons({
              message:
                "Have you finished doing the Errand/fetching the Order ?",
              recipientPhone: from,
              listOfButtons: [
                {
                  title: "Yes",
                  id: "arrievedatlocation",
                },
              ],
            });

            await Whatsapp.sendText({
              message:
                "The driver has arrived at your request location",
              recipientPhone: customer,
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });

      }
    } else {

      await Whatsapp.sendText({
        message: "The driver is en route to your specified location for the errand",
        recipientPhone:from,
      });

    }
  },
};
