export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  thumbnail_image: string;
  thumbnail_image_alt_description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceListResponse
  extends Omit<Service, "description" | "updated_at" | "created_at"> {}

export interface ServiceDetailResponse
  extends Omit<Service, "created_at" | "updated_at"> {}
