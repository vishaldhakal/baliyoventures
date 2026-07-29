export interface ProjectOrder {
  id: number;
  full_name: string;
  phone_number?: string | null;
  project_name: string;
  quantity: number;
  remarks?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ProjectOrdersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectOrder[];
}
