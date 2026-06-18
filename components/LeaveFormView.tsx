"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  UserCheck,
  Briefcase,
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
      reason_of_leave: undefined,
      approved_by: undefined,
    },
  });

  const onSubmit = async (data: LeaveFormValues) => {
    setLoading(true);
    setError("");

    try {
      await postLeaveForm(data);
      setSubmitted(true);
      form.reset({
        employee_name: "",
        employee_contact_number: "",
        employee_email: "",
        brief_reason: "",
        days: undefined,
        leave_from_date: "",
        leave_to_date: "",
        reason_of_leave: undefined,
        approved_by: undefined,
      });
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
        {/* Card */}
        <div className="bg-white rounded-2xl sm:rounded-[32px] sm:border border-gray-200 overflow-hidden">
          <div className="px-4 py-6 sm:p-8 md:p-10">
            {/* Header */}
            <div className="mb-8 ">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Leave Form
              </h1>
              <p className="text-sm text-gray-500">
                Fill in the details below to submit your leave request
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {/* Employee Information */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employee_name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="e.g. John Doe"
                              className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employee_contact_number"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Contact Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="e.g. +977 98XXXXXXXX"
                              className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employee_email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="e.g. john@example.com"
                              className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Leave Details */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reason_of_leave"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Leave Type <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all cursor-pointer">
                                <SelectValue placeholder="Select leave type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-gray-200">
                              {leaveTypeOptions.map((opt) => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                  className="text-sm focus:bg-gray-50 cursor-pointer"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Number of Days{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="e.g. 3"
                                min={1}
                                className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="leave_from_date"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            From Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="date"
                                className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all [color-scheme:light]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leave_to_date"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            To Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="date"
                                className="pl-9 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all [color-scheme:light]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="brief_reason"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Reason for Leave{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Textarea
                              placeholder="Please provide a brief reason for your leave"
                              className="pl-9 min-h-[80px] rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all resize-none"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Approval */}
                <FormField
                  control={form.control}
                  name="approved_by"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Approved By <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:border-gray-900 focus:ring-0 transition-all cursor-pointer">
                            <SelectValue placeholder="Select approver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-gray-200">
                          {approverOptions.map((name) => (
                            <SelectItem
                              key={name}
                              value={name}
                              className="text-sm focus:bg-gray-50 cursor-pointer"
                            >
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Request
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
