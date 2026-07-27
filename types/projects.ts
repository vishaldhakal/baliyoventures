export interface ProjectCategory {
  id: number;
  title: string;
  slug: string;
  icon?: string;
  thumbnail_image?: string;
  thumbnail_image_alt_description?: string | null;
  short_description?: string;
}

export interface Vendor {
  id: number;
  name: string;
  slug?: string;
  phone_no: string;
  vendor_address?: string | null;
  created_at?: string;
}

export interface ComponentModel {
  id: number;
  component: number;
  component_name?: string;
  name: string;
  slug?: string;
  specs?: string | null;
  created_at?: string;
}

export interface Component {
  id: number;
  name: string;
  slug?: string;
  vendor?: number | null;
  vendor_name?: string | null;
  vendor_details?: Vendor | null;
  no_of_models?: number;
  models_count?: number;
  models?: ComponentModel[];
  created_at?: string;
}

export interface ComponentPurchaseItem {
  id: number;
  component_model: number;
  component_model_name?: string | null;
  component_name?: string | null;
  component_slug?: string | null;
  component_model_slug?: string | null;
  quantity: number;
  price_per_item: number;
  total_price: number;
  created_at?: string;
}

export interface ComponentPurchase {
  id: number;
  vendor?: number | null;
  vendor_name?: string | null;
  vendor_phone?: string | null;
  vendor_address?: string | null;
  purchase_date?: string | null;
  total_price?: number | null;
  notes?: string | null;
  items?: ComponentPurchaseItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Inventory {
  id: number;
  component_model: number;
  component_model_details?: ComponentModel | null;
  quantity: number;
  created_at?: string;
}

export interface ProjectTool {
  id: number;
  name: string;
  slug?: string;
  created_at: string;
}

export interface SimilarProject {
  id: number;
  title: string;
  slug: string;
  status?: "in_progress" | "completed";
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_description?: string;
  meta_title?: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  project: number;
}

export interface ProjectDemo {
  id: number;
  name?: string | null;
  video_url: string | null;
  video_file: string | null;
  created_at: string;
  updated_at?: string;
  project: number;
}

export interface TechnicalDocument {
  id: number;
  name?: string | null;
  file: string | null;
  created_at: string;
  project: number;
}

export interface ProjectDailyUpdate {
  id: number;
  project: number;
  project_title?: string;
  project_slug?: string;
  task: string;
  decision?: string | null;
  reason?: string | null;
  problem?: string | null;
  created_at: string;
}

export interface ProjectInventoryUsed {
  id: number;
  project: number;
  inventory: number;
  inventory_details?: Inventory | null;
  inventory_name?: string;
  quantity: number;
  created_at?: string;
}

export interface ProjectRenderingImage {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
  project: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_description: string;
  meta_title: string;
}

export interface ProjectDetailResponse {
  id: number;
  images?: ProjectImage[];
  category?: ProjectCategory[];
  demos?: ProjectDemo[];
  tools?: ProjectTool[];
  daily_updates?: ProjectDailyUpdate[];
  technical_documents?: TechnicalDocument[];
  technical_document?: TechnicalDocument[];
  components_used?: ProjectInventoryUsed[];
  rendering_images?: ProjectRenderingImage[];
  title: string;
  slug: string;
  description: string;
  specs: string | null;
  problem_it_solves: string | null;
  case_study: string | null;
  team_member: string | null;
  meta_title: string | null;
  meta_description: string | null;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  catalogue: string | null;
  quotation: string | null;
  created_at: string;
  updated_at: string;
  similar_projects?: SimilarProject[];
}

export interface ProjectsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SimilarProject[];
}
