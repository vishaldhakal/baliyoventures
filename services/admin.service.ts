import {
  ComponentPurchaseRecord,
  ContactLead,
  DashboardOverviewStats,
  InventoryItem,
  ProjectDailyUpdateRecord,
  Vendor,
} from "@/types/admin";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

// Mock Fallback Data for rich demo visuals when backend endpoints are offline/unreachable
export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 1,
    component_model: 101,
    model_name: "STM32F407VGT6 ARM Cortex-M4 MCU",
    component_name: "Microcontrollers",
    vendor_name: "STMicroelectronics / Texel Tech",
    quantity: 45,
    min_threshold: 15,
    updated_at: "2026-07-24T10:00:00Z",
  },
  {
    id: 2,
    component_model: 102,
    model_name: "ESP32-WROOM-32E Wi-Fi/BT Module",
    component_name: "Wireless Modules",
    vendor_name: "Espressif Systems Nepal",
    quantity: 8,
    min_threshold: 20,
    updated_at: "2026-07-25T14:30:00Z",
  },
  {
    id: 3,
    component_model: 103,
    model_name: "LiFePO4 12.8V 50Ah Battery Pack",
    component_name: "Power Systems",
    vendor_name: "Sunlight Energy Tech",
    quantity: 32,
    min_threshold: 10,
    updated_at: "2026-07-22T09:15:00Z",
  },
  {
    id: 4,
    component_model: 104,
    model_name: "MPPT Solar Charge Controller 30A",
    component_name: "Solar Controllers",
    vendor_name: "Sunlight Energy Tech",
    quantity: 14,
    min_threshold: 5,
    updated_at: "2026-07-21T16:00:00Z",
  },
  {
    id: 5,
    component_model: 105,
    model_name: "NEMA 23 Stepper Motor 2.8A 1.9Nm",
    component_name: "Actuators & Motors",
    vendor_name: "Robotics Hardware Supplies",
    quantity: 4,
    min_threshold: 12,
    updated_at: "2026-07-26T08:20:00Z",
  },
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Texel Tech Supplies",
    phone_no: "+977 9841234567",
    vendor_address: "Kupondole, Lalitpur, Nepal",
  },
  {
    id: 2,
    name: "Espressif Systems Nepal",
    phone_no: "+977 9801987654",
    vendor_address: "Thapathali, Kathmandu",
  },
  {
    id: 3,
    name: "Sunlight Energy Tech",
    phone_no: "+977 9851122334",
    vendor_address: "Baneshwor, Kathmandu",
  },
  {
    id: 4,
    name: "Robotics Hardware Supplies",
    phone_no: "+977 9811556677",
    vendor_address: "Patan Industrial Estate, Lalitpur",
  },
];

export const MOCK_PURCHASES: ComponentPurchaseRecord[] = [
  {
    id: 1,
    component_model: 101,
    model_name: "STM32F407VGT6 ARM Cortex-M4 MCU",
    quantity: 50,
    price_per_item: 1250,
    total_price: 62500,
    created_at: "2026-07-15T10:00:00Z",
  },
  {
    id: 2,
    component_model: 103,
    model_name: "LiFePO4 12.8V 50Ah Battery Pack",
    quantity: 20,
    price_per_item: 28500,
    total_price: 570000,
    created_at: "2026-07-18T11:30:00Z",
  },
  {
    id: 3,
    component_model: 102,
    model_name: "ESP32-WROOM-32E Wi-Fi/BT Module",
    quantity: 100,
    price_per_item: 480,
    total_price: 48000,
    created_at: "2026-07-20T15:45:00Z",
  },
];

export const MOCK_DAILY_UPDATES: ProjectDailyUpdateRecord[] = [
  {
    id: 1,
    project: 1,
    project_title: "Smart Solar Ag-Tech IoT Controller",
    task: "Completed PCB layout optimization and RS485 communication transceiver testing.",
    decision: "Switched to industrial-grade isolation chip ISO7741 for noise immunity.",
    reason: "High switching noise observed during motor relay triggering.",
    problem: "Transient voltage spikes on signal lines.",
    created_at: "2026-07-26T09:30:00Z",
  },
  {
    id: 2,
    project: 2,
    project_title: "Autonomous Warehouse Rover",
    task: "Integrated LiDAR point cloud processing module into ROS2 navigation stack.",
    decision: "Configured local costmap resolution to 0.05m.",
    reason: "Need precise obstacle avoidance in tight aisle environments.",
    problem: "Occasional CPU latency spikes on Jetson Orin Nano during mapping.",
    created_at: "2026-07-25T17:10:00Z",
  },
  {
    id: 3,
    project: 3,
    project_title: "AI Quality Inspection Vision System",
    task: "Trained YOLOv8 model for defect classification on stainless steel welds.",
    decision: "Expanded dataset with 500 augmented infrared thermal images.",
    reason: "Improved false negative detection rate from 88% to 97.4%.",
    problem: "Overheating camera sensor in continuous high-temp test rig.",
    created_at: "2026-07-24T14:20:00Z",
  },
];

export const MOCK_CONTACT_LEADS: ContactLead[] = [
  {
    id: 1,
    name: "Ramesh Sharma",
    email: "ramesh@himalayanenergy.com",
    phone: "+977 9841112233",
    company: "baliyoventures",
    message: "Interested in joint investment & partnership for commercial solar microgrid deployment in Gandaki province.",
    created_at: "2026-07-26T08:15:00Z",
  },
  {
    id: 2,
    name: "Sita Gurung",
    email: "sita@techstart.np",
    phone: "+977 9802223344",
    company: "baliyotechnologies",
    message: "We need custom embedded hardware design & IoT telemetry firmware for automated greenhouse monitoring.",
    created_at: "2026-07-25T11:45:00Z",
  },
  {
    id: 3,
    name: "Dr. Bikash Adhikari",
    email: "bikash@kathmandu-inst.edu.np",
    phone: "+977 9851009988",
    company: "baliyoventures",
    message: "Requesting product catalogue and technical quotation for high-precision industrial stepper motor controllers.",
    created_at: "2026-07-23T16:30:00Z",
  },
];

// API Functions with Graceful Fallbacks
export const getAdminOverviewStats = async (): Promise<DashboardOverviewStats> => {
  try {
    const res = await fetch(`${API_BASE}/dashboard-stats/`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log("Using mock stats data fallback:", err);
  }
  return {
    totalProjects: 14,
    inProgressProjects: 9,
    completedProjects: 5,
    totalInventoryItems: 103,
    lowStockItemsCount: 3,
    totalPurchasesValue: 680500,
    pendingLeavesCount: 2,
    totalContactsCount: 28,
    baliyoVenturesLeads: 16,
    baliyoTechLeads: 12,
  };
};

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/inventory/`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || MOCK_INVENTORY_ITEMS;
    }
  } catch (err) {
    console.log("Using mock inventory data fallback:", err);
  }
  return MOCK_INVENTORY_ITEMS;
};

export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const res = await fetch(`${API_BASE}/vendors/`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || MOCK_VENDORS;
    }
  } catch (err) {
    console.log("Using mock vendor fallback:", err);
  }
  return MOCK_VENDORS;
};

export const getComponentPurchases = async (): Promise<ComponentPurchaseRecord[]> => {
  try {
    const res = await fetch(`${API_BASE}/component-purchases/`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || MOCK_PURCHASES;
    }
  } catch (err) {
    console.log("Using mock purchases fallback:", err);
  }
  return MOCK_PURCHASES;
};

export const getDailyUpdates = async (): Promise<ProjectDailyUpdateRecord[]> => {
  try {
    const res = await fetch(`${API_BASE}/daily-updates/`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || MOCK_DAILY_UPDATES;
    }
  } catch (err) {
    console.log("Using mock daily updates fallback:", err);
  }
  return MOCK_DAILY_UPDATES;
};

export const getContactLeads = async (): Promise<ContactLead[]> => {
  try {
    const res = await fetch(`${API_BASE}/contacts/`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || MOCK_CONTACT_LEADS;
    }
  } catch (err) {
    console.log("Using mock contact leads fallback:", err);
  }
  return MOCK_CONTACT_LEADS;
};
