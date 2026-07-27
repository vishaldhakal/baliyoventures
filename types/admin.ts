export interface Vendor {
  id: number;
  name: string;
  slug?: string;
  phone_no: string;
  vendor_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ComponentItem {
  id: number;
  name: string;
  slug?: string;
  vendor?: number | Vendor;
  vendor_name?: string;
  created_at?: string;
}

export interface ComponentModelItem {
  id: number;
  component: number | ComponentItem;
  component_name?: string;
  name: string;
  slug?: string;
  specs?: string;
  created_at?: string;
}

export interface InventoryItem {
  id: number;
  component_model: number | ComponentModelItem;
  component_model_details?: ComponentModelItem | null;
  model_name?: string;
  component_name?: string;
  vendor_name?: string;
  quantity: number;
  min_threshold?: number;
  updated_at?: string;
}

export interface ComponentPurchaseRecord {
  id: number;
  component_model: number | ComponentModelItem;
  model_name?: string;
  quantity: number;
  price_per_item: number;
  total_price: number;
  created_at: string;
}

export interface ProjectDailyUpdateRecord {
  id: number;
  project: number;
  project_title?: string;
  task: string;
  decision?: string;
  reason?: string;
  problem?: string;
  created_at: string;
}

export interface TechnicalDocumentRecord {
  id: number;
  project: number;
  name: string;
  file: string;
  created_at: string;
}

export interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: "baliyoventures" | "baliyotechnologies";
  message: string;
  created_at: string;
}

export interface DashboardOverviewStats {
  totalProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  totalInventoryItems: number;
  lowStockItemsCount: number;
  totalPurchasesValue: number;
  pendingLeavesCount: number;
  totalContactsCount: number;
  baliyoVenturesLeads: number;
  baliyoTechLeads: number;
}
