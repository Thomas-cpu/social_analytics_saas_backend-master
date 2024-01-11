import { updateStageInFirestore } from "../stages.js";

export const initialStage = {
  
  async exec({ from, message, Whatsapp, recipientName }) {
    try {



      const updateParams = {
        from: from,
        updatedFields: {
          stage: 1,
        },
      };

      updateStageInFirestore(updateParams)
        .then(async () => {
          // Stage updated successfully
          await Whatsapp.sendSimpleButtons({
            message:
              " Molo " +
              recipientName +
              "! 🌟 \nHow can we assist you today? 🤔🛠️",
            recipientPhone: from,
            listOfButtons: [
              // {
              //   title: "Order food",
              //   id: "Shopping",
              // },
              {
                title: "Errands",
                id: "Errands",
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
