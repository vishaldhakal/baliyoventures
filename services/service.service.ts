import { ServiceListResponse, ServiceDetailResponse } from "../types/services";

export const getServices = async (): Promise<ServiceListResponse[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results ?? data;
  } catch (err) {
    console.error("Failed to fetch services:", err);
    return [];
  }
};

export const getServicesDetails = async (slug: string): Promise<ServiceDetailResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch service details for: ${slug}`);
  }
  return response.json();
};





