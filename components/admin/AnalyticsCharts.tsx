"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Package, Activity, PieChart as PieIcon } from "lucide-react";

// Mock weekly hardware movement data
const stockData = [
  { name: "Microcontrollers", current: 45, threshold: 15 },
  { name: "Wireless Modules", current: 8, threshold: 20 },
  { name: "Power Systems", current: 32, threshold: 10 },
  { name: "Solar Controllers", current: 14, threshold: 5 },
  { name: "Motors & Steppers", current: 4, threshold: 12 },
];

// Mock monthly daily log progress data
const activityData = [
  { day: "Mon", updates: 4, tasksDone: 6 },
  { day: "Tue", updates: 7, tasksDone: 9 },
  { day: "Wed", updates: 5, tasksDone: 8 },
  { day: "Thu", updates: 9, tasksDone: 12 },
  { day: "Fri", updates: 11, tasksDone: 15 },
  { day: "Sat", updates: 6, tasksDone: 7 },
  { day: "Sun", updates: 3, tasksDone: 4 },
];

const leadDistribution = [
  { name: "Baliyo Ventures", value: 16, color: "#FCE8C6" },
  { name: "Baliyo Technologies", value: 12, color: "#06B6D4" },
];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Hardware Component Stock Levels */}
      <div className="lg:col-span-2 rounded-2xl bg-[#030a1c] border border-white/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-saira">
                Component Warehouse Stock & Reorder Levels
              </h3>
              <p className="text-[11px] text-gray-400">
                Current stock vs minimum safety threshold count
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-gray-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span> Stock
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Min Threshold
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#030a1c",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="current" fill="#10b981" radius={[6, 6, 0, 0]} name="In Stock" />
              <Bar dataKey="threshold" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Min Threshold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Lead Distribution */}
      <div className="rounded-2xl bg-[#030a1c] border border-white/10 p-5 space-y-4 flex flex-col justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-saira">
              Lead Share by Company
            </h3>
            <p className="text-[11px] text-gray-400">Ventures vs Technologies</p>
          </div>
        </div>

        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leadDistribution}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {leadDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#030a1c",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white font-saira">28</span>
            <span className="text-[10px] text-gray-400">Total Leads</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-gray-400 block">Baliyo Ventures</span>
            <span className="text-sm font-bold text-yellow-300 font-saira">16 (57%)</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-gray-400 block">Baliyo Tech</span>
            <span className="text-sm font-bold text-cyan-400 font-saira">12 (43%)</span>
          </div>
        </div>
      </div>

      {/* Chart 3: R&D Engineering Log Momentum */}
      <div className="lg:col-span-3 rounded-2xl bg-[#030a1c] border border-white/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-saira">
                Weekly Engineering & Daily Log Activity
              </h3>
              <p className="text-[11px] text-gray-400">
                Logged daily updates & completed engineering tasks
              </p>
            </div>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#030a1c",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="tasksDone"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorTasks)"
                strokeWidth={2}
                name="Tasks Completed"
              />
              <Area
                type="monotone"
                dataKey="updates"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorUpdates)"
                strokeWidth={2}
                name="Daily Logs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
