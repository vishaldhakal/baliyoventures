"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, AlertCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function AdminLoginView() {
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

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00040C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative w-44 h-16 bg-[#030a1c] border border-white/5 rounded-2xl px-4 py-2 flex items-center justify-center shadow-2xl">
            <Image
              src="/logo.svg"
              alt="Baliyo Ventures"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-[#FCE8C6] tracking-tight font-oxanium">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-saira">
          Sign in to access the Baliyo Ventures management panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#050b18]/80 backdrop-blur-xl py-8 px-6 border border-white/10 rounded-3xl sm:px-10 shadow-[0_0_50px_rgba(252,232,198,0.03)]">
          {error && (
            <div className="mb-6 bg-red-950/40 border border-red-500/30 rounded-2xl px-4 py-3 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm font-saira">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300 font-saira">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="baliyoventures@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/50 focus:ring-0 transition-all text-sm font-saira"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300 font-saira">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-white/10 bg-[#0c1222]/80 text-white placeholder-gray-500 focus:border-yellow-300/50 focus:ring-0 transition-all text-sm font-saira"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-yellow-300 to-[#FFFCCB] text-[#00040C] hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-oxanium shadow-lg shadow-yellow-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#00040C]" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Access Admin Panel
                    <ChevronRight className="h-4 w-4 text-[#00040C]" />
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
