import { updateStageInFirestore } from "../stages.js";

export const initialStage = {
  
  async exec({ from, message, Whatsapp, recipientName }) {
    try {

      const updateParams = {
        from: from,
        updatedFields: {
          stage: 1,
          admin:"27716880654",
          order_sent:"No"
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          // Stage updated successfully
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
        

    } catch (error) {
      console.error("Error in initialStage.exec:", error);
    }
  },
};
