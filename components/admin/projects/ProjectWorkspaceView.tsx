"use client";

import {
  Inventory,
  ProjectDetailResponse,
  ProjectTool,
  TechnicalDocument,
} from "@/types/projects";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit,
  ExternalLink,
  FileCode,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  Maximize2,
  Package,
  Play,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  User,
  Video,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectFormModal from "./ProjectFormModal";
import RichTextEditor from "./RichTextEditor";

interface ProjectWorkspaceViewProps {
  initialProject?: ProjectDetailResponse;
  projectSlug: string;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function hasValue(val?: string | null) {
  if (!val) return false;
  const stripped = val.replace(/<[^>]*>/g, "").trim();
  return stripped.length > 0;
}

function getVideoInfo(url: string): { embedUrl: string | null; thumbnailUrl: string | null; type: "youtube" | "vimeo" | "loom" | "direct" | "generic" } {
  if (!url) return { embedUrl: null, thumbnailUrl: null, type: "generic" };
  
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      type: "youtube"
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      thumbnailUrl: null,
      type: "vimeo"
    };
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return {
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`,
      thumbnailUrl: null,
      type: "loom"
    };
  }

  // Direct MP4 / WebM / OGG
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return { embedUrl: url, thumbnailUrl: null, type: "direct" };
  }

  return { embedUrl: null, thumbnailUrl: null, type: "generic" };
}

type TabType =
  | "overview"
  | "daily_updates"
  | "demos"
  | "inventory"
  | "tools"
  | "docs";

export default function ProjectWorkspaceView({
  initialProject,
  projectSlug,
}: ProjectWorkspaceViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<ProjectDetailResponse | null>(initialProject || null);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState("");
  
  const initialTab = (searchParams.get("tab") as TabType) || "overview";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [invDropdownOpen, setInvDropdownOpen] = useState(false);
  const [invSearch, setInvSearch] = useState("");

  useEffect(() => {
    if (project?.tools) {
      setSelectedToolIds(project.tools.map(t => t.id));
    }
  }, [project?.tools]);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Quick Editable Specs
  const [editingField, setEditingField] = useState<"desc" | "specs" | "problem" | "team" | "thumbnail" | null>(null);
  const [savingField, setSavingField] = useState<"desc" | "specs" | "problem" | "team" | "thumbnail" | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editSpecs, setEditSpecs] = useState("");
  const [editProblem, setEditProblem] = useState("");
  const [editCaseStudy, setEditCaseStudy] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editThumbnailAlt, setEditThumbnailAlt] = useState("");
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{
    embedUrl: string;
    name: string;
    type: string;
    directUrl: string;
  } | null>(null);

  // Demo Edit / Delete State
  const [editingDemoId, setEditingDemoId] = useState<number | null>(null);
  const [deletingDemoId, setDeletingDemoId] = useState<number | null>(null);
  const [deleteDemoTarget, setDeleteDemoTarget] = useState<{ id: number; name: string } | null>(null);


  // Daily Log Edit & Delete State
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [deleteLogTarget, setDeleteLogTarget] = useState<{ id: number; name: string } | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);

  // Inventory Used Edit & Delete State
  const [editingInvUsedId, setEditingInvUsedId] = useState<number | null>(null);
  const [deleteInvUsedTarget, setDeleteInvUsedTarget] = useState<{ id: number; name: string } | null>(null);
  const [deletingInvUsedId, setDeletingInvUsedId] = useState<number | null>(null);

  // Inventory list for "Inventory Used" tab
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);

  // Modal States
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
  const [isAddDemoModalOpen, setIsAddDemoModalOpen] = useState(false);
  const [isTagInventoryModalOpen, setIsTagInventoryModalOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);

  // Form states for sub-entities
  // 1. Daily Update Form
  const [newTask, setNewTask] = useState("");
  const [newDecision, setNewDecision] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [addingUpdate, setAddingUpdate] = useState(false);

  // 2. Demo Form
  const [newDemoName, setNewDemoName] = useState("");
  const [newDemoUrl, setNewDemoUrl] = useState("");
  const [addingDemo, setAddingDemo] = useState(false);

  // 3. Tool Form
  const [newToolName, setNewToolName] = useState("");
  const [addingTool, setAddingTool] = useState(false);
  const [allTools, setAllTools] = useState<ProjectTool[]>([]);
  const [selectedToolIds, setSelectedToolIds] = useState<number[]>([]);
  const [toolSearch, setToolSearch] = useState("");

  // 4. Tag Inventory Used Form
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | "">("");
  const [usedQuantity, setUsedQuantity] = useState<number | "">(1);
  const [addingUsedInv, setAddingUsedInv] = useState(false);

  // 5. Tech Docs Form
  const [newDocName, setNewDocName] = useState("");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [addingDoc, setAddingDoc] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      // Also fetch all tools
      const toolsRes = await fetch(`${apiBase}/project-tools/`, { cache: "no-store" });
      if (toolsRes.ok) setAllTools(await toolsRes.json());
      
      const response = await fetch(`${apiBase}/projects/${projectSlug}/`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      const data: ProjectDetailResponse = await response.json();
      setProject(data);
      setEditDescription(data.description || "");
      setEditSpecs(data.specs || "");
      setEditProblem(data.problem_it_solves || "");
      setEditCaseStudy(data.case_study || "");
      setEditTeam(data.team_member || "");
      setEditThumbnailAlt(data.thumbnail_image_alt_description || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not retrieve project workspace.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryList = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/inventory/`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setInventoryList(data.results || data);
      }
    } catch (err) {
      console.error("Error fetching inventory list:", err);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchInventoryList();
  }, [projectSlug]);

  const handleSaveField = async (
    fieldName: "description" | "specs" | "problem_it_solves" | "team_member",
    value: string,
    fieldKey: "desc" | "specs" | "problem" | "team"
  ) => {
    if (!project) return;
    setSavingField(fieldKey);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/projects/${project.slug}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [fieldName]: value }),
      });
      if (res.ok) {
        setEditingField(null);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingField(null);
    }
  };

  const handleSaveThumbnail = async () => {
    if (!project) return;
    setSavingField("thumbnail");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const formData = new FormData();
      if (editThumbnailFile) {
        formData.append("thumbnail_image", editThumbnailFile);
      }
      formData.append("thumbnail_image_alt_description", editThumbnailAlt || "");

      const res = await fetch(`${apiBase}/projects/${project.slug}/`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        setEditingField(null);
        setEditThumbnailFile(null);
        fetchDetails();
      }
    } catch (err) {
      console.error("Error saving thumbnail:", err);
    } finally {
      setSavingField(null);
    }
  };

  // 1. Create / Edit Daily Update
  const handleAddDailyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newTask.trim()) return;
    setAddingUpdate(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const isEditMode = editingLogId !== null;
      const url = isEditMode
        ? `${apiBase}/project-daily-updates/${editingLogId}/`
        : `${apiBase}/project-daily-updates/`;
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: project.id,
          task: newTask,
          decision: newDecision,
          reason: newReason,
          problem: newProblem,
        }),
      });
      if (res.ok) {
        setNewTask("");
        setNewDecision("");
        setNewReason("");
        setNewProblem("");
        setEditingLogId(null);
        setIsAddLogModalOpen(false);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingUpdate(false);
    }
  };

  // 1b. Delete Daily Update
  const handleDeleteDailyUpdate = async (id: number) => {
    setDeletingLogId(id);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/project-daily-updates/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingLogId(null);
    }
  };

  // 2. Create / Edit Video Demo
  const handleAddDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newDemoName.trim()) return;
    setAddingDemo(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const isEditMode = editingDemoId !== null;
      const url = isEditMode
        ? `${apiBase}/project-demos/${editingDemoId}/`
        : `${apiBase}/project-demos/`;
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: project.id,
          name: newDemoName,
          video_url: newDemoUrl,
        }),
      });
      if (res.ok) {
        setNewDemoName("");
        setNewDemoUrl("");
        setEditingDemoId(null);
        setIsAddDemoModalOpen(false);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingDemo(false);
    }
  };

  // 2c. Delete Video Demo
  const handleDeleteDemo = async (id: number) => {
    setDeletingDemoId(id);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/project-demos/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingDemoId(null);
    }
  };

  // 3. Create Tool

  // 4. Create Vendor


  // 5. Create Component


  // 6. Create Component Model


  // 7. Create Component Purchase


  // 8. Create / Update Inventory Stock


  // 9. Tag / Edit Inventory Used in Project
  const handleTagInventoryUsed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !selectedInventoryId || !usedQuantity) return;
    setAddingUsedInv(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const isEditMode = editingInvUsedId !== null;
      const url = isEditMode
        ? `${apiBase}/project-inventory-used/${editingInvUsedId}/`
        : `${apiBase}/project-inventory-used/`;
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: project.id,
          inventory: selectedInventoryId,
          quantity: parseInt(usedQuantity.toString(), 10),
        }),
      });
      if (res.ok) {
        setSelectedInventoryId("");
        setUsedQuantity(1);
        setEditingInvUsedId(null);
        setIsTagInventoryModalOpen(false);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingUsedInv(false);
    }
  };

  // 9b. Delete Inventory Used
  const handleDeleteInventoryUsed = async (id: number) => {
    setDeletingInvUsedId(id);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/project-inventory-used/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingInvUsedId(null);
    }
  };

  // 10. Tech Docs Upload & Delete Handlers
  const handleAddTechDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newDocName.trim()) return;
    setAddingDoc(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const formData = new FormData();
      formData.append("project", project.id.toString());
      formData.append("name", newDocName.trim());
      if (newDocFile) {
        formData.append("file", newDocFile);
      }

      const res = await fetch(`${apiBase}/technical-documents/`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setNewDocName("");
        setNewDocFile(null);
        setIsAddDocModalOpen(false);
        fetchDetails();
      }
    } catch (err) {
      console.error("Error uploading technical document:", err);
    } finally {
      setAddingDoc(false);
    }
  };

  const handleDeleteTechDoc = async (docId: number) => {
    if (!project) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/technical-documents/${docId}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDetails();
      }
    } catch (err) {
      console.error("Error deleting technical document:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 font-sans">
        <Loader2 className="h-8 w-8 text-slate-700 animate-spin" />
        <span className="text-xs text-slate-500">Loading project workspace...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen p-8 space-y-4 text-center flex flex-col items-center justify-center font-sans">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs max-w-md">
          {error || "Project workspace not found."}
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 min-h-screen font-sans">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            href="/admin"
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer shrink-0 shadow-xs"
            title="Back to Projects"
          >
            <ArrowLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </Link>
          <div className="min-w-0 flex-1">

            <h1 className="text-xl sm:text-2xl md:text-2xl text-slate-900 tracking-tight mt-0.5 truncate">
              {project.title}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Edit className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Edit Metadata</span>
          <span className="sm:hidden">Edit</span>
        </button>
      </div>

      {/* Main Full-Page Workspace Container */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        {/* Navigation Tabs Header */}
        {(() => {
          const tabItems = [
            { id: "overview", label: "Details & Specs", shortLabel: "Overview", icon: FileText, count: null },
            { id: "daily_updates", label: "Daily Engineering Logs", shortLabel: "Daily Logs", icon: Clock, count: project.daily_updates?.length || 0 },
            { id: "demos", label: "Video Demos", shortLabel: "Demos", icon: Video, count: project.demos?.length || 0 },
            { id: "inventory", label: "Hardware Inventory Used", shortLabel: "Inventory", icon: Package, count: project.components_used?.length || 0 },
            { id: "tools", label: "Tools & Tech Stack", shortLabel: "Tools & Tech", icon: Wrench, count: project.tools?.length || 0 },
            { id: "docs", label: "Technical Documents", shortLabel: "Tech Docs", icon: FileCode, count: project.technical_documents?.length || project.technical_document?.length || 0 },
          ];

          const activeTabObj = tabItems.find(t => t.id === activeTab) || tabItems[0];
          const ActiveIcon = activeTabObj.icon;

          return (
            <>
              {/* MOBILE ONLY: Section Dropdown Selector */}
              <div className="sm:hidden border-b border-slate-200 bg-slate-50/80 p-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 text-white shadow-sm cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ActiveIcon className="h-4 w-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-bold truncate">{activeTabObj.label}</span>
                      {activeTabObj.count !== null && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {activeTabObj.count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                      <span className="text-[10px] font-semibold text-slate-300">
                        {tabItems.findIndex(t => t.id === activeTab) + 1} of {tabItems.length}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${isMobileNavOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Dropdown Menu Overlay */}
                  <AnimatePresence>
                    {isMobileNavOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs"
                          onClick={() => setIsMobileNavOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden py-1"
                        >
                          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Workspace Section</span>
                            <span className="text-[10px] font-medium text-slate-500">{tabItems.length} Sections</span>
                          </div>
                          {tabItems.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  setActiveTab(tab.id as TabType);
                                  router.push(`?tab=${tab.id}`, { scroll: false });
                                  setIsMobileNavOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs transition-colors cursor-pointer border-b border-slate-100 last:border-0 ${
                                  isActive
                                    ? "bg-slate-900 text-white font-bold"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                                  <span className="truncate">{tab.label}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {tab.count !== null && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                                      isActive ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                                    }`}>
                                      {tab.count}
                                    </span>
                                  )}
                                  {isActive && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* DESKTOP / TABLET ONLY: Horizontal Tab Bar */}
              <div className="hidden sm:flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-xs font-medium text-slate-600 no-scrollbar select-none">
                {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  const displayCount = tab.count !== null ? ` (${tab.count})` : "";
                  const fullLabel = `${tab.shortLabel}${displayCount}`;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as TabType);
                        router.push(`?tab=${tab.id}`, { scroll: false });
                      }}
                      className={`flex items-center gap-2 px-5 py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                        activeTab === tab.id
                          ? "border-slate-900 text-slate-900 bg-white font-bold"
                          : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{fullLabel}</span>
                    </button>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* Tab Contents */}
        <div className="space-y-0">
          {/* TAB 1: DETAILS & SPECS OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              {/* Top Header Panel */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-700" /> Project Specs & Overview
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Technical specifications, description, problem statement, and team.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Metadata
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">

              {/* 0. Thumbnail Image Section */}
              {(project.thumbnail_image || editingField === "thumbnail") && (
                <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-slate-700 shrink-0" /> Thumbnail Image
                    </h4>
                    {editingField === "thumbnail" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingField(null);
                            setEditThumbnailFile(null);
                          }}
                          disabled={savingField === "thumbnail"}
                          className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveThumbnail}
                          disabled={savingField === "thumbnail"}
                          className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {savingField === "thumbnail" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-white" />
                          ) : (
                            <Save className="h-3 w-3 text-white" />
                          )}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditThumbnailAlt(project.thumbnail_image_alt_description || "");
                          setEditingField("thumbnail");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" /> Edit
                      </button>
                    )}
                  </div>

                  {editingField === "thumbnail" ? (
                    <div className="space-y-4 pt-1">
                      {(editThumbnailFile || project.thumbnail_image) && (
                        <div
                          onClick={() => {
                            const src = editThumbnailFile
                              ? URL.createObjectURL(editThumbnailFile)
                              : project.thumbnail_image;
                            if (src) setPreviewImage(src);
                          }}
                          className="relative w-full max-w-sm sm:w-52 h-44 sm:h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group"
                        >
                          <img
                            src={
                              editThumbnailFile
                                ? URL.createObjectURL(editThumbnailFile)
                                : (project.thumbnail_image || undefined)
                            }
                            alt="Thumbnail Preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                            <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">Upload New Thumbnail</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setEditThumbnailFile(e.target.files ? e.target.files[0] : null)
                          }
                          className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-200 file:text-slate-800 file:font-semibold file:cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">Alt Text Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Front view of automated feed mixer project"
                          value={editThumbnailAlt}
                          onChange={(e) => setEditThumbnailAlt(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                  ) : project.thumbnail_image ? (
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div
                        onClick={() => setPreviewImage(project.thumbnail_image)}
                        className="relative w-full max-w-sm sm:w-52 h-44 sm:h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs shrink-0 cursor-pointer group"
                      >
                        <Image
                          src={project.thumbnail_image}
                          alt={project.thumbnail_image_alt_description || project.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                          <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {project.thumbnail_image_alt_description && (
                        <div className="pt-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Alt Description</span>
                          <p className="text-xs text-slate-700 font-medium">{project.thumbnail_image_alt_description}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* 1. Primary Description */}
              {(hasValue(project.description) || editingField === "desc") && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="h-4 w-4 text-slate-700" /> Primary Description
                    </h4>
                    {editingField === "desc" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          disabled={savingField === "desc"}
                          className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveField("description", editDescription, "desc")}
                          disabled={savingField === "desc"}
                          className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {savingField === "desc" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-white" />
                          ) : (
                            <Save className="h-3 w-3 text-white" />
                          )}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditDescription(project.description || "");
                          setEditingField("desc");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" /> Edit
                      </button>
                    )}
                  </div>

                  {editingField === "desc" ? (
                    <RichTextEditor value={editDescription} onChange={setEditDescription} placeholder="Edit project description..." />
                  ) : (
                    <div className="text-slate-700 text-xs leading-relaxed prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: project.description! }} />
                  )}
                </div>
              )}

              {/* 2. Technical Specifications */}
              {(hasValue(project.specs) || editingField === "specs") && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Award className="h-4 w-4 text-slate-700" /> Technical Specifications
                    </h4>
                    {editingField === "specs" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          disabled={savingField === "specs"}
                          className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveField("specs", editSpecs, "specs")}
                          disabled={savingField === "specs"}
                          className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {savingField === "specs" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-white" />
                          ) : (
                            <Save className="h-3 w-3 text-white" />
                          )}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditSpecs(project.specs || "");
                          setEditingField("specs");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" /> Edit
                      </button>
                    )}
                  </div>

                  {editingField === "specs" ? (
                    <RichTextEditor value={editSpecs} onChange={setEditSpecs} placeholder="Edit technical specifications..." />
                  ) : (
                    <div className="text-slate-700 text-xs leading-relaxed prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: project.specs! }} />
                  )}
                </div>
              )}

              {/* 3. Problem Solved */}
              {(hasValue(project.problem_it_solves) || editingField === "problem") && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-slate-700" /> Problem It Solves
                    </h4>
                    {editingField === "problem" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          disabled={savingField === "problem"}
                          className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveField("problem_it_solves", editProblem, "problem")}
                          disabled={savingField === "problem"}
                          className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {savingField === "problem" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-white" />
                          ) : (
                            <Save className="h-3 w-3 text-white" />
                          )}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditProblem(project.problem_it_solves || "");
                          setEditingField("problem");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" /> Edit
                      </button>
                    )}
                  </div>

                  {editingField === "problem" ? (
                    <RichTextEditor value={editProblem} onChange={setEditProblem} placeholder="Edit problem it solves..." />
                  ) : (
                    <div className="text-slate-700 text-xs leading-relaxed prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: project.problem_it_solves! }} />
                  )}
                </div>
              )}

              {/* 4. Team Members */}
              {(hasValue(project.team_member) || editingField === "team") && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-700" /> Team Members Involved
                    </h4>
                    {editingField === "team" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          disabled={savingField === "team"}
                          className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveField("team_member", editTeam, "team")}
                          disabled={savingField === "team"}
                          className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {savingField === "team" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-white" />
                          ) : (
                            <Save className="h-3 w-3 text-white" />
                          )}
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditTeam(project.team_member || "");
                          setEditingField("team");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="h-3 w-3 text-slate-500" /> Edit
                      </button>
                    )}
                  </div>

                  {editingField === "team" ? (
                    <RichTextEditor value={editTeam} onChange={setEditTeam} placeholder="Edit team members..." />
                  ) : (
                    <div className="text-slate-700 text-xs leading-relaxed prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: project.team_member! }} />
                  )}
                </div>
              )}

              {/* Add Missing Optional Sections */}
              {(!project.thumbnail_image && editingField !== "thumbnail" ||
                !hasValue(project.description) && editingField !== "desc" ||
                !hasValue(project.specs) && editingField !== "specs" ||
                !hasValue(project.problem_it_solves) && editingField !== "problem" ||
                !hasValue(project.team_member) && editingField !== "team") && (
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Add Details:
                  </span>
                  {!project.thumbnail_image && editingField !== "thumbnail" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditThumbnailAlt("");
                        setEditingField("thumbnail");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Thumbnail Image
                    </button>
                  )}
                  {!hasValue(project.description) && editingField !== "desc" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditDescription("");
                        setEditingField("desc");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Primary Description
                    </button>
                  )}
                  {!hasValue(project.specs) && editingField !== "specs" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditSpecs("");
                        setEditingField("specs");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Technical Specifications
                    </button>
                  )}
                  {!hasValue(project.problem_it_solves) && editingField !== "problem" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditProblem("");
                        setEditingField("problem");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Problem It Solves
                    </button>
                  )}
                  {!hasValue(project.team_member) && editingField !== "team" && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditTeam("");
                        setEditingField("team");
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Team Members
                    </button>
                  )}
                </div>
              )}
              </div>
            </div>
          )}

          {/* TAB 2: DAILY ENGINEERING LOGS */}
          {activeTab === "daily_updates" && (
            <div className="space-y-0">
              {/* Top Header Panel */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-700" /> Daily R&D Engineering Updates
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Track R&D progress, daily updates, architectural decisions, and technical blockers.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingLogId(null);
                      setNewTask("");
                      setNewDecision("");
                      setNewReason("");
                      setNewProblem("");
                      setIsAddLogModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" /> Log Update
                  </button>
                </div>
              </div>

              {/* Logs List */}
              {project.daily_updates && project.daily_updates.length > 0 ? (
                <div>
                  {project.daily_updates.map((log) => {
                    const hasExtras = log.decision || log.reason || log.problem;
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 sm:gap-4 p-4 sm:px-5 sm:py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Icon */}
                        <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-slate-400">
                              {timeAgo(log.created_at)} ({formatTime(log.created_at)})
                            </span>

                            {/* Actions: Edit & Delete */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLogId(log.id);
                                  setNewTask(log.task || "");
                                  setNewDecision(log.decision || "");
                                  setNewReason(log.reason || "");
                                  setNewProblem(log.problem || "");
                                  setIsAddLogModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit Log"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteLogTarget({
                                    id: log.id,
                                    name: log.task ? (log.task.length > 30 ? log.task.slice(0, 30) + "..." : log.task) : "Daily Log",
                                  })
                                }
                                disabled={deletingLogId === log.id}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-30"
                                title="Delete Log"
                              >
                                {deletingLogId === log.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                            {log.task}
                          </p>

                          {hasExtras && (
                            <div className="mt-2.5 flex flex-col sm:flex-row sm:flex-wrap gap-2.5 pt-1">
                              {log.decision && (
                                <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 w-full sm:max-w-md">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Decision</span>
                                    <p className="text-[11px] text-emerald-900 leading-snug">{log.decision}</p>
                                  </div>
                                </div>
                              )}
                              {log.reason && (
                                <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200/80 w-full sm:max-w-md">
                                  <HelpCircle className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Reason</span>
                                    <p className="text-[11px] text-blue-900 leading-snug">{log.reason}</p>
                                  </div>
                                </div>
                              )}
                              {log.problem && (
                                <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50/80 border border-rose-200/80 w-full sm:max-w-md">
                                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Problem</span>
                                    <p className="text-[11px] text-rose-900 leading-snug">{log.problem}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">No daily engineering logs added yet</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Log Update" above to log engineering updates</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO DEMOS */}
          {activeTab === "demos" && (
            <div className="space-y-0">
              {/* Top Header Panel */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5 flex items-center gap-2">
                      <Video className="h-4 w-4 text-slate-700" /> Video Demos
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Product demos and video walk-throughs.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingDemoId(null);
                      setNewDemoName("");
                      setNewDemoUrl("");
                      setIsAddDemoModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Video Demo
                  </button>
                </div>
              </div>

              {/* Demos List */}
              {project.demos && project.demos.length > 0 ? (
                <div>
                  {project.demos.map((d) => {
                    const { embedUrl, thumbnailUrl, type } = getVideoInfo(d.video_url || "");

                    return (
                      <div
                        key={d.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:px-5 sm:py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                          {/* Compact Video Thumbnail */}
                          <div
                            onClick={() => {
                              if (embedUrl) {
                                setPreviewVideo({
                                  embedUrl,
                                  name: d.name || "Video Demo",
                                  type,
                                  directUrl: d.video_url || "",
                                });
                              } else if (d.video_url) {
                                window.open(d.video_url, "_blank");
                              }
                            }}
                            className="relative w-28 h-18 bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-200 cursor-pointer group shadow-xs"
                          >
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={d.name || "Video Demo"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <Video className="h-5 w-5 text-slate-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                                <Play className="h-3.5 w-3.5 text-slate-900 fill-slate-900 ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="min-w-0 space-y-1 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{d.name}</h4>
                            {d.video_url && (
                              <a
                                href={d.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline flex items-center gap-1 truncate"
                              >
                                <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">{d.video_url}</span>
                                <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions: Open, Edit, Delete */}
                        <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {d.video_url && (
                            <a
                              href={d.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="h-3 w-3 text-slate-500" /> Open
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDemoId(d.id);
                              setNewDemoName(d.name || "");
                              setNewDemoUrl(d.video_url || "");
                              setIsAddDemoModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Demo"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteDemoTarget({ id: d.id, name: d.name || "Video Demo" })}
                            disabled={deletingDemoId === d.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-30"
                            title="Delete Demo"
                          >
                            {deletingDemoId === d.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                    <Video className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">No video demos added yet</p>
                  <p className="text-xs text-slate-400 mt-1">Click "Add Video Demo" above to add product video walk-throughs</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HARDWARE INVENTORY USED */}
          {activeTab === "inventory" && (
            <div className="space-y-0">
              {/* Top Header Panel (matching Tools & Tech) */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5 flex items-center gap-2">
                      <Package className="h-4 w-4 text-slate-700" /> Hardware Inventory Used
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Select and tag inventory components used for this project.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingInvUsedId(null);
                      setSelectedInventoryId("");
                      setUsedQuantity(1);
                      setIsTagInventoryModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tag Inventory Used
                  </button>
                </div>
              </div>

              {/* Attached Inventory List (matching Tools & Tech item rows) */}
              {project.components_used && project.components_used.length > 0 ? (
                <div>
                  {project.components_used.map((item) => {
                    const componentName = item.inventory_details?.component_model_details?.component_name;
                    const modelName = item.inventory_details?.component_model_details?.name || `Inventory #${item.inventory}`;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Icon */}
                        <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <Package className="h-3.5 w-3.5 text-slate-500" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">{modelName}</p>
                            {componentName && (
                              <p className="text-[10px] text-slate-400 font-mono truncate">{componentName}</p>
                            )}
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        {/* Actions: Edit & Remove */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingInvUsedId(item.id);
                              setSelectedInventoryId(item.inventory ? item.inventory : "");
                              setUsedQuantity(item.quantity || 1);
                              setIsTagInventoryModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Edit Tagged Item"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteInvUsedTarget({
                                id: item.id,
                                name: modelName,
                              })
                            }
                            disabled={deletingInvUsedId === item.id}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-30"
                            title="Remove Tagged Item"
                          >
                            {deletingInvUsedId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">No hardware inventory tagged yet</p>
                  <p className="text-xs text-slate-400 mt-1">Use the button above to tag inventory components</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TOOLS ATTACHED */}
          {activeTab === "tools" && (() => {
            const currentToolIds = new Set((project.tools || []).map(t => t.id));
            const searchLower = toolSearch.toLowerCase().trim();
            const filtered = allTools.filter(t =>
              t.name.toLowerCase().includes(searchLower)
            );
            const exactMatch = allTools.some(t => t.name.toLowerCase() === searchLower);
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

            // Attach an existing tool by id — optimistic local update, no full refetch
            const attachToolById = async (toolId: number, tool: ProjectTool) => {
              if (currentToolIds.has(toolId) || addingTool) return;
              setAddingTool(true);
              // Optimistic update
              setProject(prev => prev ? { ...prev, tools: [...(prev.tools || []), tool] } : prev);
              setToolSearch("");
              try {
                await fetch(`${apiBase}/projects/${project.slug}/`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tool_ids: [...Array.from(currentToolIds), toolId] }),
                });
              } catch (err) {
                console.error(err);
                // Revert on failure
                fetchDetails();
              } finally {
                setAddingTool(false);
              }
            };

            // Create by name (backend handles get_or_create) — optimistic local update
            const attachToolByName = async (name: string) => {
              if (!name.trim() || addingTool) return;
              setAddingTool(true);
              setToolSearch("");
              try {
                const res = await fetch(`${apiBase}/projects/${project.slug}/`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tool_names: [name.trim()] }),
                });
                if (res.ok) {
                  const updated = await res.json();
                  // Update tools from the response — no full reload
                  setProject(prev => prev ? { ...prev, tools: updated.tools ?? prev.tools } : prev);
                  // Also refresh allTools list in case a new tool was created
                  fetch(`${apiBase}/project-tools/`, { cache: "no-store" })
                    .then(r => r.ok ? r.json() : null)
                    .then(d => d && setAllTools(d));
                }
              } catch (err) {
                console.error(err);
              } finally {
                setAddingTool(false);
              }
            };

            // Remove a tool — optimistic local update
            const removeToolById = async (toolId: number) => {
              if (addingTool) return;
              setAddingTool(true);
              // Optimistic update
              setProject(prev => prev ? { ...prev, tools: (prev.tools || []).filter(t => t.id !== toolId) } : prev);
              try {
                const newIds = (project.tools || []).filter(t => t.id !== toolId).map(t => t.id);
                await fetch(`${apiBase}/projects/${project.slug}/`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tool_ids: newIds }),
                });
              } catch (err) {
                console.error(err);
                fetchDetails(); // Revert on failure
              } finally {
                setAddingTool(false);
              }
            };

            return (
            <div className="space-y-0">
              {/* Search & Add Panel */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 mb-0.5">Tools & Technologies</p>
                    <p className="text-[11px] text-slate-500">
                      Search to attach an existing tool, or type a new name and press{" "}
                      <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[10px] font-mono">Enter</kbd>{" "}
                      to create & attach.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-auto sm:min-w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 z-10" />
                    {addingTool && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 animate-spin z-10" />
                    )}
                    <input
                      type="text"
                      placeholder="Search or create new tool..."
                      value={toolSearch}
                      onChange={(e) => setToolSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (filtered.length === 1 && !currentToolIds.has(filtered[0].id)) {
                            attachToolById(filtered[0].id, filtered[0]);
                          } else if (searchLower && !exactMatch) {
                            attachToolByName(toolSearch.trim());
                          } else if (exactMatch) {
                            const match = allTools.find(t => t.name.toLowerCase() === searchLower);
                            if (match) attachToolById(match.id, match);
                          }
                        }
                        if (e.key === "Escape") setToolSearch("");
                      }}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all shadow-sm"
                    />
                    {/* Dropdown */}
                    {searchLower && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                        {filtered.map(t => {
                          const isAttached = currentToolIds.has(t.id);
                          return (
                            <button
                              key={t.id}
                              disabled={isAttached || addingTool}
                              onClick={() => attachToolById(t.id, t)}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-slate-50 transition-colors disabled:opacity-60 border-b border-slate-100 last:border-0"
                            >
                              <div className="flex items-center gap-2">
                                <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-800">{t.name}</span>
                              </div>
                              {isAttached ? (
                                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                                  ✓ Attached
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 shrink-0">+ Add</span>
                              )}
                            </button>
                          );
                        })}
                        {!exactMatch && searchLower && (
                          <button
                            disabled={addingTool}
                            onClick={() => attachToolByName(toolSearch.trim())}
                            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs hover:bg-indigo-50 transition-colors text-indigo-700 font-semibold border-t border-indigo-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Create & attach "{toolSearch.trim()}"
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attached Tools List */}
              {project.tools && project.tools.length > 0 ? (
                <div>
                  {project.tools.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Icon */}
                      <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Wrench className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{t.slug || t.name.toLowerCase().replace(/\s+/g, "-")}</p>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeToolById(t.id)}
                        disabled={addingTool}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-30 shrink-0"
                        title="Remove tool"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                    <Wrench className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">No tools attached yet</p>
                  <p className="text-xs text-slate-400 mt-1">Use the search above to find or create tools</p>
                </div>
              )}
            </div>
            );
          })()}

          {/* TAB 8: TECH DOCS */}
          {activeTab === "docs" && (() => {
            const docsList: TechnicalDocument[] = project.technical_documents || project.technical_document || [];
            return (
              <div className="space-y-0">
                {/* Top Header Panel */}
                <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-0.5 flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-slate-700" /> Technical Documents
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Upload technical manuals, specs, or PDF documentation.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddDocModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                    >
                      <Plus className="h-3.5 w-3.5" /> Upload Document
                    </button>
                  </div>
                </div>

                {/* Documents List */}
                {docsList.length > 0 ? (
                  <div>
                    {docsList.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:px-5 sm:py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileCode className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-semibold text-slate-800 truncate">{doc.name || "Untitled Document"}</h5>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Added {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto">
                          {doc.file && (
                            <a
                              href={doc.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="h-3 w-3 text-slate-500" /> View / Download
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteTechDoc(doc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                      <FileCode className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">No technical documents uploaded yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Upload Document" above to add technical manuals or specs</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

            {/* Edit Project Form Modal */}
      <AnimatePresence>
        {isAddLogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddLogModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingLogId ? "Edit Daily R&D Update" : "Log Daily R&D Update"}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[240px] sm:max-w-none">Attached to {project.title}</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddLogModalOpen(false);
                    setEditingLogId(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto">
                <form id="add-log-form" onSubmit={handleAddDailyUpdate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Engineering Task *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What engineering task was completed today?"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Decision Made</label>
                    <input
                      type="text"
                      placeholder="Any architectural or design decision made? (optional)"
                      value={newDecision}
                      onChange={(e) => setNewDecision(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Reasoning</label>
                    <input
                      type="text"
                      placeholder="Why was this decision made? (optional)"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Blocker / Problem</label>
                    <input
                      type="text"
                      placeholder="Any issues encountered? (optional)"
                      value={newProblem}
                      onChange={(e) => setNewProblem(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-log-form"
                  disabled={addingUpdate || !newTask.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingUpdate ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Update
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Demo Modal */}
        {isAddDemoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddDemoModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">
                  {editingDemoId ? "Edit Video Demo" : "Add Video Demo"}
                </h3>
                <button
                  onClick={() => {
                    setIsAddDemoModalOpen(false);
                    setEditingDemoId(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto">
                <form id="add-demo-form" onSubmit={handleAddDemo} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Demo Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Version 1 Prototype Test"
                      value={newDemoName}
                      onChange={(e) => setNewDemoName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Video URL</label>
                    <input
                      type="url"
                      placeholder="YouTube, Vimeo, or Loom Link"
                      value={newDemoUrl}
                      onChange={(e) => setNewDemoUrl(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDemoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-demo-form"
                  disabled={addingDemo || !newDemoName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingDemo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Demo
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Inventory Used Modal */}
        {isTagInventoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsTagInventoryModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">
                  {editingInvUsedId ? "Edit Tagged Inventory" : "Tag Inventory Used"}
                </h3>
                <button
                  onClick={() => {
                    setIsTagInventoryModalOpen(false);
                    setEditingInvUsedId(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto">
                <form id="add-inventory-form" onSubmit={handleTagInventoryUsed} className="space-y-4">
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Inventory Item *</label>
                    {(() => {
                      const selectedItem = inventoryList.find(inv => inv.id === selectedInventoryId);
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => setInvDropdownOpen(!invDropdownOpen)}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-slate-400 transition-all cursor-pointer text-left shadow-xs"
                          >
                            {selectedItem ? (
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Package className="h-4 w-4 text-slate-500 shrink-0" />
                                <div className="min-w-0 flex-1 truncate">
                                  <span className="font-semibold text-slate-800">
                                    {selectedItem.component_model_details?.name || `Inventory #${selectedItem.id}`}
                                  </span>
                                  {selectedItem.component_model_details?.component_name && (
                                    <span className="text-slate-400 text-[11px] ml-1.5 font-mono">
                                      ({selectedItem.component_model_details.component_name})
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                  Stock: {selectedItem.quantity}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">-- Select Component Inventory Item --</span>
                            )}
                            <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${invDropdownOpen ? "rotate-180" : ""}`} />
                          </button>

                          <AnimatePresence>
                            {invDropdownOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setInvDropdownOpen(false)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-60 flex flex-col"
                                >
                                  {/* Search Box */}
                                  <div className="p-2.5 bg-slate-50 border-b border-slate-100 relative shrink-0">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 z-10" />
                                    <input
                                      type="text"
                                      placeholder="Search inventory items..."
                                      value={invSearch}
                                      onChange={(e) => setInvSearch(e.target.value)}
                                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all"
                                    />
                                  </div>

                                  {/* Item List */}
                                  <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                                    {inventoryList.filter((inv) => {
                                      if (!invSearch.trim()) return true;
                                      const q = invSearch.toLowerCase();
                                      const cName = inv.component_model_details?.component_name?.toLowerCase() || "";
                                      const mName = inv.component_model_details?.name?.toLowerCase() || "";
                                      return cName.includes(q) || mName.includes(q);
                                    }).length > 0 ? (
                                      inventoryList
                                        .filter((inv) => {
                                          if (!invSearch.trim()) return true;
                                          const q = invSearch.toLowerCase();
                                          const cName = inv.component_model_details?.component_name?.toLowerCase() || "";
                                          const mName = inv.component_model_details?.name?.toLowerCase() || "";
                                          return cName.includes(q) || mName.includes(q);
                                        })
                                        .map((inv) => {
                                          const isSelected = selectedInventoryId === inv.id;
                                          const mName = inv.component_model_details?.name || `Inventory #${inv.id}`;
                                          const cName = inv.component_model_details?.component_name;

                                          return (
                                            <button
                                              key={inv.id}
                                              type="button"
                                              onClick={() => {
                                                setSelectedInventoryId(inv.id);
                                                setInvDropdownOpen(false);
                                                setInvSearch("");
                                              }}
                                              className={`w-full flex items-center justify-between p-3 text-xs transition-colors cursor-pointer text-left ${
                                                isSelected ? "bg-slate-900 text-white font-bold" : "hover:bg-slate-50 text-slate-800"
                                              }`}
                                            >
                                              <div className="min-w-0 flex-1">
                                                <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                                                  {mName}
                                                </p>
                                                {cName && (
                                                  <p className={`text-[10px] font-mono truncate ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                                                    {cName}
                                                  </p>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                  isSelected ? "bg-slate-800 text-emerald-300 border border-slate-700" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                }`}>
                                                  Stock: {inv.quantity}
                                                </span>
                                                {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                                              </div>
                                            </button>
                                          );
                                        })
                                    ) : (
                                      <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                        No inventory items matching "{invSearch}"
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </>
                      );
                    })()}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Quantity Used *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="E.g. 2"
                      value={usedQuantity}
                      onChange={(e) => setUsedQuantity(e.target.value ? parseInt(e.target.value, 10) : "")}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTagInventoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-inventory-form"
                  disabled={addingUsedInv || !selectedInventoryId}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingUsedInv ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Tag Inventory
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Tech Doc Modal */}
        {isAddDocModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddDocModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Upload Technical Document</h3>
                <button
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto">
                <form id="add-doc-form" onSubmit={handleAddTechDoc} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Document Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Motor Specifications"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">File</label>
                    <input
                      type="file"
                      accept="application/pdf,application/msword,.doc,.docx,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => setNewDocFile(e.target.files?.[0] || null)}
                      className="w-full p-2 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-200 file:text-slate-800 cursor-pointer"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-doc-form"
                  disabled={addingDoc || !newDocName.trim()}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {addingDoc ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Upload Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Image Preview Lightbox Modal */}
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className="fixed inset-0"
              onClick={() => setPreviewImage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] z-10 flex flex-col items-center justify-center pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 sm:-top-12 sm:right-0 p-2 text-white hover:text-slate-300 bg-slate-800/80 rounded-full transition-all cursor-pointer shadow-lg z-20"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 max-h-[85vh]">
                <img
                  src={previewImage}
                  alt="Full size preview"
                  className="max-h-[85vh] max-w-full object-contain rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
        {/* Video Preview Lightbox Modal */}
        {previewVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className="fixed inset-0"
              onClick={() => setPreviewVideo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl z-10 flex flex-col items-center justify-center pointer-events-auto space-y-3"
            >
              <div className="w-full flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-lg">{previewVideo.name}</h3>
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="p-1.5 text-white hover:text-slate-300 bg-slate-800/80 rounded-full transition-all cursor-pointer shadow-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 aspect-video bg-black">
                {previewVideo.type === "direct" ? (
                  <video controls autoPlay src={previewVideo.embedUrl} className="w-full h-full" />
                ) : (
                  <iframe
                    src={previewVideo.embedUrl}
                    title={previewVideo.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
        {/* Custom Delete Confirmation Modal */}
        {deleteDemoTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
            <div
              className="fixed inset-0"
              onClick={() => setDeleteDemoTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Delete Video Demo</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleteDemoTarget.name}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteDemoTarget(null)}
                  disabled={deletingDemoId === deleteDemoTarget.id}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleDeleteDemo(deleteDemoTarget.id);
                    setDeleteDemoTarget(null);
                  }}
                  disabled={deletingDemoId === deleteDemoTarget.id}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {deletingDemoId === deleteDemoTarget.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete Demo
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Custom Delete Inventory Used Confirmation Modal */}
        {deleteInvUsedTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
            <div
              className="fixed inset-0"
              onClick={() => setDeleteInvUsedTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Remove Tagged Inventory</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Are you sure you want to remove <span className="font-semibold text-slate-800">"{deleteInvUsedTarget.name}"</span> from this project?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteInvUsedTarget(null)}
                  disabled={deletingInvUsedId === deleteInvUsedTarget.id}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleDeleteInventoryUsed(deleteInvUsedTarget.id);
                    setDeleteInvUsedTarget(null);
                  }}
                  disabled={deletingInvUsedId === deleteInvUsedTarget.id}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {deletingInvUsedId === deleteInvUsedTarget.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Remove Tag
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Custom Delete Daily Log Confirmation Modal */}
        {deleteLogTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
            <div
              className="fixed inset-0"
              onClick={() => setDeleteLogTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900">Delete Daily Log</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleteLogTarget.name}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteLogTarget(null)}
                  disabled={deletingLogId === deleteLogTarget.id}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleDeleteDailyUpdate(deleteLogTarget.id);
                    setDeleteLogTarget(null);
                  }}
                  disabled={deletingLogId === deleteLogTarget.id}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {deletingLogId === deleteLogTarget.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Edit Project Form Modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          fetchDetails();
          router.refresh();
        }}
        projectSlug={project.slug}
      />
    </div>
  );
}
