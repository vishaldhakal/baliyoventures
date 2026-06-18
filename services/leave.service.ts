import { LeaveFormValues } from "@/lib/schema/leave-form-schema";

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
