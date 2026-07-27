import {Contact} from "@/types/contact"

export const postContactForm = async (data: Contact): Promise<void> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
  const response = await fetch(`${apiBase}/contacts/`, {
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