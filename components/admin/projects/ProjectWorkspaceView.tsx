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
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  ExternalLink,
  FileCode,
  FileText,
  HelpCircle,
  Images,
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

function getVideoInfo(url: string): { embedUrl: string | null; thumbnailUrl: string | null; type: "youtube" | "instagram" | "facebook" | "tiktok" | "vimeo" | "loom" | "direct" | "generic" } {
  if (!url) return { embedUrl: null, thumbnailUrl: null, type: "generic" };
  const cleanUrl = url.trim();
  
  // YouTube
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      type: "youtube"
    };
  }

  // Instagram
  const igMatch = cleanUrl.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (igMatch && igMatch[1]) {
    return {
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
      thumbnailUrl: null,
      type: "instagram"
    };
  }

  // Facebook
  if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) {
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=false`,
      thumbnailUrl: null,
      type: "facebook"
    };
  }

  // TikTok
  const tiktokMatch = cleanUrl.match(/(?:tiktok\.com\/@[^\/]+\/video\/|tiktok\.com\/embed\/v2\/)([0-9]+)/);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      thumbnailUrl: null,
      type: "tiktok"
    };
  }

  // Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      thumbnailUrl: null,
      type: "vimeo"
    };
  }

  // Loom
  const loomMatch = cleanUrl.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return {
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`,
      thumbnailUrl: null,
      type: "loom"
    };
  }

  // Direct MP4 / WebM / OGG
  if (/\.(mp4|webm|ogg)($|\?)/i.test(cleanUrl)) {
    return { embedUrl: cleanUrl, thumbnailUrl: null, type: "direct" };
  }

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return { embedUrl: cleanUrl, thumbnailUrl: null, type: "generic" };
  }

  return { embedUrl: null, thumbnailUrl: null, type: "generic" };
}

type TabType =
  | "overview"
  | "daily_updates"
  | "demos"
  | "images"
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
    if (project?.tools_used) {
      setSelectedToolIds(project.tools_used.map(tu => tu.tool));
    }
  }, [project?.tools_used]);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable Title State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(initialProject?.title || "");
  const [savingTitle, setSavingTitle] = useState(false);

  // Quick Editable Specs
  const [editingField, setEditingField] = useState<"desc" | "specs" | "problem" | "team" | "thumbnail" | null>(null);
  const [savingField, setSavingField] = useState<"desc" | "specs" | "problem" | "team" | "thumbnail" | null>(null);

  const handleSaveTitle = async () => {
    if (!project || !editTitle.trim()) return;
    setSavingTitle(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/projects/${project.slug}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (res.ok) {
        const updatedData = await res.json();
        setProject((prev) => (prev ? { ...prev, title: updatedData.title || editTitle.trim() } : prev));
        setIsEditingTitle(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save title:", err);
    } finally {
      setSavingTitle(false);
    }
  };
  const [editDescription, setEditDescription] = useState("");
  const [editSpecs, setEditSpecs] = useState("");
  const [editProblem, setEditProblem] = useState("");
  const [editCaseStudy, setEditCaseStudy] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editThumbnailAlt, setEditThumbnailAlt] = useState("");
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [previewImagesList, setPreviewImagesList] = useState<string[]>([]);
  const [previewImageIndex, setPreviewImageIndex] = useState<number | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{
    embedUrl: string;
    name: string;
    type: string;
    directUrl: string;
  } | null>(null);

  const openImagePreview = (images: string[], index: number = 0) => {
    setPreviewImagesList(images);
    setPreviewImageIndex(index);
  };

  const handlePrevImage = () => {
    if (previewImageIndex === null || previewImagesList.length === 0) return;
    setPreviewImageIndex((prev) =>
      prev === null ? 0 : (prev - 1 + previewImagesList.length) % previewImagesList.length
    );
  };

  const handleNextImage = () => {
    if (previewImageIndex === null || previewImagesList.length === 0) return;
    setPreviewImageIndex((prev) =>
      prev === null ? 0 : (prev + 1) % previewImagesList.length
    );
  };

  useEffect(() => {
    if (previewImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextImage();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setPreviewImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImageIndex, previewImagesList]);

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

  // Images Modal & Delete State
  const [isAddImagesModalOpen, setIsAddImagesModalOpen] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [addingImages, setAddingImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState<{ id: number; url: string } | null>(null);

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
  const [newToolQuantity, setNewToolQuantity] = useState<number | "">("");

  // 4. Tag Inventory Used Form
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | "">("");
  const [usedQuantity, setUsedQuantity] = useState<number | "">(1);
  const [addingUsedInv, setAddingUsedInv] = useState(false);
  const [fetchingInventory, setFetchingInventory] = useState(false);

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
      const toolsRes = await fetch(`${apiBase}/project-tools/?page_size=100`, { cache: "no-store" });
      if (toolsRes.ok) {
        const toolsData = await toolsRes.json();
        setAllTools(Array.isArray(toolsData) ? toolsData : toolsData.results || []);
      }
      
      const response = await fetch(`${apiBase}/projects/${projectSlug}/`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      const data: ProjectDetailResponse = await response.json();
      setProject(data);
      setEditTitle(data.title || "");
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

  const fetchInventoryList = async (query = "") => {
    setFetchingInventory(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const url = query.trim()
        ? `${apiBase}/inventory/?search=${encodeURIComponent(query.trim())}`
        : `${apiBase}/inventory/`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setInventoryList(data.results || data);
      }
    } catch (err) {
      console.error("Error fetching inventory list:", err);
    } finally {
      setFetchingInventory(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchInventoryList();
  }, [projectSlug]);

  useEffect(() => {
    if (!invSearch.trim()) return;
    const timer = setTimeout(() => {
      fetchInventoryList(invSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [invSearch]);

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

  // Multiple Images Upload & Delete Handlers
  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImageFile = (index: number) => {
    setImagePreviews((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || newImageFiles.length === 0) return;
    setAddingImages(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const uploadPromises = newImageFiles.map((file) => {
        const formData = new FormData();
        formData.append("project", project.id.toString());
        formData.append("image", file);
        return fetch(`${apiBase}/images/`, {
          method: "POST",
          body: formData,
        });
      });

      await Promise.all(uploadPromises);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setNewImageFiles([]);
      setImagePreviews([]);
      setIsAddImagesModalOpen(false);
      fetchDetails();
    } catch (err) {
      console.error("Error uploading images:", err);
    } finally {
      setAddingImages(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!project) return;
    setDeletingImageId(imageId);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
    try {
      const res = await fetch(`${apiBase}/images/${imageId}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDetails();
      }
    } catch (err) {
      console.error("Error deleting image:", err);
    } finally {
      setDeletingImageId(null);
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
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") {
                      setEditTitle(project.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-full text-lg sm:text-xl font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  placeholder="Enter project title..."
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  disabled={savingTitle || !editTitle.trim()}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  title="Save title"
                >
                  {savingTitle ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditTitle(project.title);
                    setIsEditingTitle(false);
                  }}
                  disabled={savingTitle}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer shrink-0"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                <h1
                  className="text-xl sm:text-2xl md:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate hover:text-slate-700 transition-colors"
                  title="Click to edit project title"
                >
                  {project.title}
                </h1>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all opacity-70 group-hover:opacity-100 shrink-0"
                  title="Edit title"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            )}
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
            { id: "images", label: "Project Gallery", shortLabel: "Gallery", icon: Images, count: project.images?.length || 0 },
            { id: "inventory", label: "Hardware Inventory Used", shortLabel: "Inventory", icon: Package, count: project.components_used?.length || 0 },
            { id: "tools", label: "Tools & Tech Stack", shortLabel: "Tools & Tech", icon: Wrench, count: project.tools_used?.length || 0 },
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
                            if (src) openImagePreview([src], 0);
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
                        onClick={() => {
                          const allImgs = [
                            ...(project.thumbnail_image ? [project.thumbnail_image] : []),
                            ...(project.images ? project.images.map((i) => i.image) : []),
                          ];
                          openImagePreview(allImgs.length > 0 ? allImgs : [project.thumbnail_image!], 0);
                        }}
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

          {/* TAB: PROJECT GALLERY / IMAGES */}
          {activeTab === "images" && (
            <div>
              {/* Top Header Panel */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5 flex items-center gap-2">
                    <Images className="h-4 w-4 text-slate-700" /> Project Gallery ({project.images?.length || 0})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Upload and manage high-resolution images & diagrams for this project.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddImagesModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" /> Upload Images
                </button>
              </div>

              {/* Images Grid */}
              <div className="p-4 sm:p-6 md:p-8">
                {!project.images || project.images.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                      <Images className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                      <h4 className="text-xs font-bold text-slate-800">No project images yet</h4>
                      <p className="text-[11px] text-slate-500">
                        Upload photos, circuit diagrams, hardware renders, or schematics for this project.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddImagesModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" /> Upload First Images
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {project.images.map((imgItem, idx) => (
                      <div
                        key={imgItem.id || idx}
                        className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
                      >
                        {/* Image Thumbnail Container */}
                        <div
                          onClick={() => openImagePreview(project.images!.map((i) => i.image), idx)}
                          className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
                        >
                          <Image
                            src={imgItem.image}
                            alt={`Project image ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Overlay actions on hover */}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openImagePreview(project.images!.map((i) => i.image), idx);
                              }}
                              className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 transition-transform active:scale-95 shadow-md cursor-pointer"
                              title="View full screen"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteImageTarget({ id: imgItem.id, url: imgItem.image });
                              }}
                              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-transform active:scale-95 shadow-md cursor-pointer"
                              title="Delete image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";

            // Attach an existing tool by id — POST to project-tool-used

            // Create tool by name then attach — creates ProjectTool first, then attaches

            // Update inline tool quantity via PATCH on project-tool-used
            const updateToolQuantity = async (toolUsedId: number, quantity: number | null) => {
              setProject((prev) =>
                prev
                  ? {
                      ...prev,
                      tools_used: (prev.tools_used || []).map((tu) =>
                        tu.id === toolUsedId ? { ...tu, quantity } : tu
                      ),
                    }
                  : prev
              );

              try {
                await fetch(`${apiBase}/project-tool-used/${toolUsedId}/`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ quantity }),
                });
              } catch (err) {
                console.error("Error updating tool quantity:", err);
                fetchDetails();
              }
            };

            // Remove a tool — DELETE /project-tool-used/<id>/
            const removeToolUsed = async (toolUsedId: number) => {
              if (addingTool) return;
              setAddingTool(true);
              // Optimistic update
              setProject(prev => prev ? { ...prev, tools_used: (prev.tools_used || []).filter(tu => tu.id !== toolUsedId) } : prev);
              try {
                await fetch(`${apiBase}/project-tool-used/${toolUsedId}/`, {
                  method: "DELETE",
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
              {/* Header Panel with Add Button */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5">Tools & Technologies</p>
                    <p className="text-[11px] text-slate-500">
                      Manage tools, frameworks, and equipment used in this project.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddToolModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Attach Tool
                  </button>
                </div>
              </div>

              {/* Attached Tools List */}
              {project.tools_used && project.tools_used.length > 0 ? (
                <div>
                  {project.tools_used.map((tu) => {
                    const toolFromAll = allTools.find((t) => t.id === tu.tool);
                    const hasQuantity = toolFromAll ? toolFromAll.quantity != null : tu.tool_details?.quantity != null;

                    return (
                      <div
                        key={tu.id}
                        className="flex items-center justify-between gap-3 sm:gap-4 p-4 sm:px-5 sm:py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Icon */}
                          <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <Wrench className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                          {/* Name & Slug */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{tu.tool_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{tu.tool_slug || (tu.tool_name || "").toLowerCase().replace(/\s+/g, "-")}</p>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Inline Quantity Modifier - Only if tool has quantity specified in allTools API */}
                          {hasQuantity && (
                            <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 rounded-lg px-2 py-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Qty:</span>
                              <input
                              type="number"
                              min="1"
                              placeholder="—"
                              value={tu.quantity != null ? tu.quantity : ""}
                              onChange={(e) => {
                                const val = e.target.value === "" ? null : Math.max(1, parseInt(e.target.value) || 1);
                                updateToolQuantity(tu.id, val);
                              }}
                              className="w-12 text-center text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 py-0.5 outline-none focus:border-slate-400"
                            />
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeToolUsed(tu.id)}
                          disabled={addingTool}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-30 shrink-0"
                          title="Remove tool"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
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

              <div className="p-4 sm:p-6 space-y-4">
                <form id="add-inventory-form" onSubmit={handleTagInventoryUsed} className="space-y-4">
                  <div className="space-y-1.5 relative z-30">
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
                                  className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-56 flex flex-col"
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
                                    {fetchingInventory ? (
                                      <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" /> Searching inventory...
                                      </div>
                                    ) : inventoryList.length > 0 ? (
                                      inventoryList.map((inv) => {
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

                  <div className="space-y-1.5 relative z-10">
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

              <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
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
        {/* Image Preview Lightbox Modal with Key & Button Navigation */}
        {previewImageIndex !== null && previewImagesList.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div
              className="fixed inset-0"
              onClick={() => setPreviewImageIndex(null)}
            />

            <motion.div
              key={previewImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative max-w-5xl w-full max-h-[90vh] z-10 flex flex-col items-center justify-center pointer-events-auto"
            >
              {/* Top Header / Counter Bar */}
              <div className="w-full flex items-center justify-between mb-3 px-1 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono font-semibold text-slate-200 shadow-md">
                    Image {previewImageIndex + 1} of {previewImagesList.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewImageIndex(null)}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-full transition-all cursor-pointer shadow-lg border border-slate-700"
                  title="Close (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Image Display with Navigation Buttons */}
              <div className="relative w-full flex items-center justify-center group">
                {/* Previous Image Button */}
                {previewImagesList.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-white transition-all transform active:scale-90 shadow-xl cursor-pointer hover:scale-105"
                    title="Previous image (Left Arrow)"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Current Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/60 max-h-[78vh] flex items-center justify-center">
                  <img
                    src={previewImagesList[previewImageIndex]}
                    alt={`Preview image ${previewImageIndex + 1}`}
                    className="max-h-[78vh] max-w-full object-contain select-none"
                  />
                </div>

                {/* Next Image Button */}
                {previewImagesList.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 text-white transition-all transform active:scale-90 shadow-xl cursor-pointer hover:scale-105"
                    title="Next image (Right Arrow)"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Key Help Legend */}
              {previewImagesList.length > 1 && (
                <div className="mt-3 text-[11px] text-slate-400 font-medium flex items-center gap-3">
                  <span>Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">→</kbd> arrow keys or side buttons to navigate</span>
                </div>
              )}
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
        {/* Modal for Uploading Project Images */}
        <AnimatePresence>
          {isAddImagesModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
              <div
                className="fixed inset-0"
                onClick={() => {
                  setIsAddImagesModalOpen(false);
                  imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                  setNewImageFiles([]);
                  setImagePreviews([]);
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xl z-10 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <Images className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Upload Project Images</h3>
                      <p className="text-[11px] text-slate-500">Select one or multiple images to add to this project.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddImagesModalOpen(false);
                      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                      setNewImageFiles([]);
                      setImagePreviews([]);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleAddImages} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Select Image Files
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-4 text-center bg-slate-50/50 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageFilesChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="space-y-1">
                        <Images className="h-8 w-8 text-slate-400 group-hover:text-slate-600 mx-auto transition-colors" />
                        <p className="text-xs font-semibold text-slate-700">
                          Click or drag images to upload
                        </p>
                        <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, GIF (multiple allowed)</p>
                      </div>
                    </div>
                  </div>

                  {/* Selected File Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600">
                          Selected Images ({imagePreviews.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                            setNewImageFiles([]);
                            setImagePreviews([]);
                          }}
                          className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-xl">
                        {imagePreviews.map((previewUrl, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                            <img src={previewUrl} alt={`Selected ${i}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImageFile(i)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddImagesModalOpen(false);
                        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                        setNewImageFiles([]);
                        setImagePreviews([]);
                      }}
                      disabled={addingImages}
                      className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingImages || newImageFiles.length === 0}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {addingImages ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      {addingImages ? "Uploading..." : `Upload ${newImageFiles.length > 0 ? `${newImageFiles.length} ` : ""}Images`}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- ATTACH TOOL MODAL --- */}
        <AnimatePresence>
          {isAddToolModalOpen && (() => {
            const searchLower = toolSearch.toLowerCase().trim();
            const attachedToolIds = new Set((project?.tools_used || []).map(tu => tu.tool));
            const filteredTools = allTools.filter(t => t.name.toLowerCase().includes(searchLower));
            const selectedToolObj = allTools.find(t => t.id === Number(selectedToolIds[0] || selectedToolIds));

            const handleAttachTool = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!project || (!selectedToolIds[0] && !toolSearch.trim())) return;
              setAddingTool(true);
              const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://yachu.baliyoventures.com/api/baliyo";
              const qtyNum = newToolQuantity !== "" ? Number(newToolQuantity) : null;

              try {
                let toolIdToAttach = selectedToolIds[0] ? Number(selectedToolIds[0]) : null;

                // If user typed a tool name that doesn't exist in dropdown, create tool first
                if (!toolIdToAttach && toolSearch.trim()) {
                  const match = allTools.find(t => t.name.toLowerCase() === toolSearch.trim().toLowerCase());
                  if (match) {
                    toolIdToAttach = match.id;
                  } else {
                    const createRes = await fetch(`${apiBase}/project-tools/`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: toolSearch.trim() }),
                    });
                    if (createRes.ok) {
                      const newTool = await createRes.json();
                      toolIdToAttach = newTool.id;
                      fetch(`${apiBase}/project-tools/`, { cache: "no-store" })
                        .then(r => r.ok ? r.json() : null)
                        .then(d => d && setAllTools(d));
                    }
                  }
                }

                if (toolIdToAttach) {
                  const res = await fetch(`${apiBase}/project-tool-used/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      project: project.id,
                      tool: toolIdToAttach,
                      quantity: qtyNum,
                    }),
                  });
                  if (res.ok) {
                    setIsAddToolModalOpen(false);
                    setToolSearch("");
                    setNewToolQuantity("");
                    setSelectedToolIds([]);
                    setInvDropdownOpen(false);
                    fetchDetails();
                  }
                }
              } catch (err) {
                console.error(err);
              } finally {
                setAddingTool(false);
              }
            };

            return (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 font-sans">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
                  onClick={() => {
                    setIsAddToolModalOpen(false);
                    setToolSearch("");
                    setNewToolQuantity("");
                    setSelectedToolIds([]);
                    setInvDropdownOpen(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl z-10 flex flex-col"
                >
                  <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-slate-700" />
                      <h3 className="text-sm font-bold text-slate-900">Attach Tool to Project</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddToolModalOpen(false);
                        setToolSearch("");
                        setNewToolQuantity("");
                        setSelectedToolIds([]);
                        setInvDropdownOpen(false);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAttachTool} className="p-4 sm:p-5 space-y-4">
                    {/* Tool Select Dropdown with Search */}
                    <div className="relative z-30">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Select Tool / Technology <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div
                          onClick={() => setInvDropdownOpen(!invDropdownOpen)}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 cursor-pointer hover:bg-white focus:border-slate-400 transition-all"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Wrench className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className={selectedToolObj ? "text-slate-900 font-semibold truncate" : "text-slate-400 truncate"}>
                              {selectedToolObj ? selectedToolObj.name : "Select or search tool..."}
                            </span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${invDropdownOpen ? "rotate-180" : ""}`} />
                        </div>

                        {invDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setInvDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-56 flex flex-col">
                            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                  type="text"
                                  placeholder="Search tools..."
                                  value={toolSearch}
                                  onChange={(e) => setToolSearch(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-400"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="overflow-y-auto max-h-40 divide-y divide-slate-100">
                              {filteredTools.map((t) => {
                                const isAttached = attachedToolIds.has(t.id);
                                const isSelected = selectedToolIds[0] === t.id;
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    disabled={isAttached}
                                    onClick={() => {
                                      setSelectedToolIds([t.id]);
                                      setInvDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer disabled:opacity-50 ${
                                      isSelected ? "bg-slate-100 font-bold" : "hover:bg-slate-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-slate-800 truncate">{t.name}</span>
                                      {t.quantity != null && (
                                        <span className="text-[10px] text-slate-400 font-mono">
                                          (Qty: {t.quantity})
                                        </span>
                                      )}
                                    </div>
                                    {isAttached && (
                                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                                        Attached
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                              {filteredTools.length === 0 && toolSearch.trim() && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedToolIds([]);
                                    setInvDropdownOpen(false);
                                  }}
                                  className="w-full p-3 text-xs text-indigo-600 font-semibold text-center hover:bg-indigo-50"
                                >
                                  + Create & attach "{toolSearch.trim()}"
                                </button>
                              )}
                            </div>
                          </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity Field - Only shown if selected tool has quantity */}
                    {selectedToolObj && selectedToolObj.quantity != null && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          Quantity to Use <span className="text-rose-500">*</span>
                          <span className="text-slate-400 font-normal normal-case ml-1">
                            (Available in stock: {selectedToolObj.quantity})
                          </span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={selectedToolObj.quantity}
                          required
                          placeholder={`Enter quantity (max ${selectedToolObj.quantity})`}
                          value={newToolQuantity}
                          onChange={(e) =>
                            setNewToolQuantity(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-400 transition-all"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddToolModalOpen(false);
                          setToolSearch("");
                          setNewToolQuantity("");
                          setSelectedToolIds([]);
                          setInvDropdownOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addingTool || (!selectedToolIds[0] && !toolSearch.trim())}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        {addingTool ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        Attach Tool
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
        {/* Custom Delete Image Confirmation Modal */}
        {deleteImageTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
            <div
              className="fixed inset-0"
              onClick={() => setDeleteImageTarget(null)}
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
                  <h3 className="text-base font-bold text-slate-900">Delete Project Image</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Are you sure you want to delete this image? This action cannot be undone.
                  </p>
                  {deleteImageTarget.url && (
                    <div className="mt-3 relative w-32 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={deleteImageTarget.url} alt="To delete" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteImageTarget(null)}
                  disabled={deletingImageId === deleteImageTarget.id}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleDeleteImage(deleteImageTarget.id);
                    setDeleteImageTarget(null);
                  }}
                  disabled={deletingImageId === deleteImageTarget.id}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {deletingImageId === deleteImageTarget.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete Image
                </button>
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
