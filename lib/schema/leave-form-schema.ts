import { z } from "zod";

export const leaveFormSchema = z.object({
  employee_name: z.string().min(2, {
    message: "Employee name must be at least 2 characters.",
  }),
  employee_contact_number: z
    .string()
    .regex(/^\d+$/, { message: "Contact number must contain digits only." })
    .min(7, { message: "Contact number must be at least 7 digits." })
    .max(15, { message: "Contact number must be at most 15 digits." }),
  employee_email: z
    .string()
    .email({
      message: "Please enter a valid email address (e.g. name@gmail.com).",
    }),
  reason_of_leave: z.enum(["paid", "sick", "unpaid", "weekly", "other"], {
    required_error: "Please select a leave type.",
  }),
  brief_reason: z.string().min(5, {
    message: "Please provide a brief reason (at least 5 characters).",
  }),
  days: z.coerce
    .number({ invalid_type_error: "Please enter a valid number." })
    .int({ message: "Days must be a whole number." })
    .min(1, { message: "Days must be at least 1." })
    .max(365, { message: "Days cannot exceed 365." }),
  leave_from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format.",
  }),
  leave_to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format.",
  }),
  approved_by: z.enum(
    ["Anil Singh", "Prithvi Chaudhary", "Manav Khadka", "Sapana Dhakal"],
    {
      required_error: "Please select an approver.",
    },
  ),
});

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;
