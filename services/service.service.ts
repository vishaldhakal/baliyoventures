import { ServiceListResponse, ServiceDetailResponse } from "../types/services";

export const getServices = async (): Promise<ServiceListResponse[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
  return response.json();
};

export const getServicesDetails = async (slug: string): Promise<ServiceDetailResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`);
  return response.json();
};
