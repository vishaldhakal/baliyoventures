import { LeaveFormValues } from "@/lib/schema/leave-form-schema";

export interface LeaveFormRecord {
  id: number;
  employee_name: string;
  employee_contact_number: string;
  employee_email: string;
  reason_of_leave: "paid" | "sick" | "unpaid" | "weekly" | "other";
  brief_reason: string;
  days: number;
  leave_from_date: string;
  leave_to_date: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveFormListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LeaveFormRecord[];
}

export const postLeaveForm = async (data: LeaveFormValues): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/leave-forms/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData ? JSON.stringify(errorData) : "Network response was not ok"
    );
  }
};

export const getLeaveForms = async (
  page: number = 1,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<LeaveFormListResponse> => {
  const params = new URLSearchParams();
  if (page > 1) {
    params.append("page", String(page));
  }
  if (search) {
    params.append("search", search);
  }
  if (startDate) {
    params.append("start_date", startDate);
  }
  if (endDate) {
    params.append("end_date", endDate);
  }

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/leave-forms/${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData ? JSON.stringify(errorData) : "Failed to fetch leave forms"
    );
  }

  return response.json();
};
