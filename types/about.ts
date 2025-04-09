export interface TeamMember {
  id: number; 
  name: string;
  designation?: string | null;
  image?: string | null;
  image_alt_description?: string | null;
  department?: number | null; 
  email?: string | null;
  phone?: string | null; 
  facebook?: string | null; 
  instagram?: string | null; 
  twitter?: string | null;
  linkedin?: string | null; 
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
id:number;
  name: string;
  message: string;
  rating: number;
  designation?: string; // Optional field
  image: string; // Optional field
  image_alt_description?: string; // Optional field
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Faq {
  question: string;
  answer: string;
  createdAt: Date; // Use camelCase for TypeScript conventions
  updatedAt: Date; // Use camelCase for TypeScript conventions
}

export interface Partner {
  id: number;
  title: string;
  image: string;
  image_alt_description: string;
  website_url?: string | null; // Optional field
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}


export interface Gallery {
  id: number; // Unique identifier for the gallery item
  title: string; // Title of the image
  media: string; // URL of the image
  media_type: string; // Type of media (e.g., "image")
  media_alt_description: string; // Alt text for the image
}
