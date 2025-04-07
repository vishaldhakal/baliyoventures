import {Contact} from "@/types/contact"

export const postContactForm = async (data: Contact): Promise<void> => {
  const response = await fetch(`https://yachu.baliyoventures.com/api/baliyo/contacts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
}; 