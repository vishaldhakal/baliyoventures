import { TeamMember,Testimonial,Faq,  Partner,Gallery} from "@/types/about";


export const getTeam = async (): Promise<TeamMember []> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team-members/`);
  return response.json();
};



export const getTestimonials = async (): Promise<Testimonial []> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/`);
  return response.json();
};

export const getFaq = async (): Promise<Faq []> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs/`);
  return response.json();
};

export const getGallery = async (): Promise<Gallery []> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/?media_type=image`);
  return response.json();
};

export const getPartner = async (): Promise<Partner[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/our-partners/`);
  return response.json();
};



