import { TeamMember, Testimonial, Faq, Partner, Gallery } from "@/types/about";

export const getTeam = async (): Promise<TeamMember[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/team-members/`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/testimonials/`,
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
};

export const getFaq = async (): Promise<Faq[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs/`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch faqs:", error);
    return [];
  }
};

export const getGallery = async (): Promise<Gallery[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gallery/?media_type=image`,
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return [];
  }
};

export const getPartner = async (): Promise<Partner[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/our-partners/`,
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    return [];
  }
};

