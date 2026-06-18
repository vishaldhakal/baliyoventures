"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  leaveFormSchema,
  type LeaveFormValues,
} from "@/lib/schema/leave-form-schema";
import { useState } from "react";
import { postLeaveForm } from "@/services/leave.service";
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle2,
  Loader2,
  Briefcase,
  Hash,
  UserCheck,
} from "lucide-react";

const leaveTypeOptions = [
  { value: "paid", label: "Paid Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
  { value: "weekly", label: "Weekly Off" },
  { value: "other", label: "Other" },
];

const approverOptions = [
  "Anil Singh",
  "Prithvi Chaudhary",
  "Manav Khadka",
  "Sapana Dhakal",
];

const inputClass =
  "w-full bg-white rounded-lg px-4 py-2.5 text-gray-900 text-sm transition-all duration-200";

const labelClass =
  "absolute -top-2 left-3 px-1.5 text-[11px] font-medium text-gray-500 group-focus-within:text-gray-700 bg-white z-10 transition-colors duration-200";

export default function LeaveFormView() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      employee_name: "",
      employee_contact_number: "",
      employee_email: "",
      brief_reason: "",
      days: undefined,
      leave_from_date: "",
      leave_to_date: "",
    },
  });

  const onSubmit = async (data: LeaveFormValues) => {
    setLoading(true);
    setError("");

    try {
      await postLeaveForm(data);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error("Error submitting leave form:", err);
      setError("There was an error submitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Request Submitted
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Your Leave Form has been successfully submitted. You'll receive a
            confirmation via email.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6"
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Leave Form
          </h1>
          <p className="text-gray-600 text-sm">
            Fill in the details below to submit your Leave Form
          </p>
        </div>

        {/* Form */}
        <div className="sm:bg-white sm:rounded-xl sm:border sm:border-gray-200 sm:-sm sm:overflow-hidden sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Employee Information */}
              <div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employee_name"
                    render={({ field }) => (
                      <FormItem className="relative group">
                        <FormLabel className={labelClass}>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=" "
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employee_contact_number"
                    render={({ field }) => (
                      <FormItem className="relative group">
                        <FormLabel className={labelClass}>
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder=" "
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employee_email"
                    render={({ field }) => (
                      <FormItem className="relative group">
                        <FormLabel className={labelClass}>
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder=" "
                            className={inputClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Leave Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reason_of_leave"
                  render={({ field }) => (
                    <FormItem className="relative group">
                      <FormLabel className={labelClass}>Leave Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`${inputClass} cursor-pointer`}
                          >
                            <SelectValue placeholder=" " />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                          {leaveTypeOptions.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              className="focus:bg-gray-50 focus:text-gray-900 cursor-pointer text-sm"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem className="relative group">
                      <FormLabel className={labelClass}>
                        Number of Days
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder=" "
                          min={1}
                          className={inputClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leave_from_date"
                    render={({ field }) => (
                      <FormItem className="relative group">
                        <FormLabel className={labelClass}>From Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className={`${inputClass} [color-scheme:light]`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leave_to_date"
                    render={({ field }) => (
                      <FormItem className="relative group">
                        <FormLabel className={labelClass}>To Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className={`${inputClass} [color-scheme:light]`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="brief_reason"
                  render={({ field }) => (
                    <FormItem className="relative group">
                      <FormLabel className={labelClass}>
                        Reason for Leave
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=" "
                          className={inputClass}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="approved_by"
                render={({ field }) => (
                  <FormItem className="relative group">
                    <FormLabel className={labelClass}>Approved By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`${inputClass} cursor-pointer`}
                        >
                          <SelectValue placeholder=" " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-gray-200 text-gray-900">
                        {approverOptions.map((name) => (
                          <SelectItem
                            key={name}
                            value={name}
                            className="focus:bg-gray-50 focus:text-gray-900 cursor-pointer text-sm"
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
