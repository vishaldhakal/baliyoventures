"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function LeaveFormLoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/leave-form/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-16 bg-[#00040C] rounded-2xl px-4 py-2 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Baliyo Ventures"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Admin Control Panel
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to manage employee leave requests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 border border-gray-200/80 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@baliyoventures.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-0 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-0 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="h-4 w-4 text-white" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
