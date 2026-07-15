"use client";

import { useState } from "react";

interface Resource {
  id: string;
  category: string;
  title: string;
  description: string;
  type: "module" | "pdf" | "audio" | "video";
  meta: string;
  linkText: string;
  imgUrl?: string;
}

export default function ResourceLibraryPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // New Program states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Rules & Regulations");
  const [newDesc, setNewDesc] = useState("");
  const [newMeta, setNewMeta] = useState("");

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "res-1",
      category: "Awareness Programs",
      title: "Comprehensive Workplace Safety Guidelines 2026",
      description: "A complete module covering the latest regulations, proactive safety measures, and reporting protocols for professional environments. Designed for HR and employees.",
      type: "module",
      meta: "45 min module",
      linkText: "Start Module",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASBeE3RqQEOXC4MbhVfReeLHsXNCOMqe18j0GuF-5-L18VZFAZDXMsOO4L0pu0O29qfusfcbui5rFA4HfhGAm60evCMGweu8nI1cJSafYp6XvcVqVFmFXh3CsHw-H9V5NFZn8-iiAY3vRnhQWk6jqg8tMWI5TIPEFjAsJY_Rl0jk7PX2z8BMzaXUpselvhYFBUR3E-o_AdgwpiCxOi69k2Inj9Ow1-pO3cnBcGLXOKC8PVV06BqaNS",
    },
    {
      id: "res-2",
      category: "Rules & Regulations",
      title: "Digital Privacy Rights & Protection",
      description: "Understand your legal rights online and learn technical steps to secure your personal data against cyber threats.",
      type: "pdf",
      meta: "PDF Document (1.2MB)",
      linkText: "Download PDF Guide",
    },
    {
      id: "res-3",
      category: "Confidence Building",
      title: "Assertive Communication Workshop",
      description: "Audio series on setting boundaries, vocal empowerment, and handling difficult verbal situations.",
      type: "audio",
      meta: "6-part Audio Series",
      linkText: "Listen Now",
    },
    {
      id: "res-4",
      category: "Self-Employment",
      title: "Freelancing Basics & Financial Independence",
      description: "Video course on starting your own digital consultation service safely, marketing your skills, and building assets.",
      type: "video",
      meta: "12 Video Lessons",
      linkText: "View Course",
    },
    {
      id: "res-5",
      category: "Rules & Regulations",
      title: "POCSO Act & Women Legal Codes",
      description: "An easy-to-digest pocket breakdown of active constitutional sections protecting women against workplace violence.",
      type: "pdf",
      meta: "PDF Booklet (800KB)",
      linkText: "Download Booklet",
    },
  ]);

  const categories = ["All", "Rules & Regulations", "Awareness Programs", "Self-Employment", "Confidence Building"];

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const newResource: Resource = {
      id: `res-${Date.now()}`,
      category: newCategory,
      title: newTitle,
      description: newDesc,
      type: "module",
      meta: newMeta || "15 min quick read",
      linkText: "Start Module",
    };

    setResources((prev) => [newResource, ...prev]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewMeta("");
  };

  const filteredResources = resources.filter((item) => {
    const matchesCategory = filter === "All" || item.category === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-12 flex-grow font-body-md">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-primary mb-3">
            Awareness & Resource Library
          </h1>
          <p className="font-body-lg text-on-surface-variant text-base md:text-lg">
            Empower yourself with knowledge. Explore guidelines, training modules, and skill-building resources designed to enhance your safety and independence.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-bold text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Create Awareness Program
        </button>
      </header>

      {/* Filters & Search */}
      <div className="mb-8 glass-panel rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white/40">
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-label-bold text-xs font-bold transition-all cursor-pointer border ${
                filter === cat
                  ? "bg-primary-container text-on-primary-container border-primary-container"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container border-outline/10"
              }`}
            >
              {cat === "Rules & Regulations" ? "Rules & Regs" : cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/50 border border-outline-variant/30 rounded-full py-2.5 pl-11 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner placeholder:text-outline-variant"
            placeholder="Search resources..."
            type="text"
          />
        </div>
      </div>

      {/* Resource Cards Layout */}
      {filteredResources.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-3xl border text-on-surface-variant font-semibold">
          No resources matches your filter. Check back later or create a new program.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {filteredResources.map((item, index) => {
            // Render the first item (featured) as a large 8-column layout card if it has an image
            const isFeatured = item.imgUrl && index === 0;

            if (isFeatured) {
              return (
                <article
                  key={item.id}
                  className="md:col-span-8 glass-panel rounded-3xl overflow-hidden shadow-sm flex flex-col group relative border border-white/50"
                >
                  <div className="h-64 w-full relative overflow-hidden bg-surface-variant">
                    <img
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-700"
                      alt={item.title}
                      src={item.imgUrl}
                    />
                    <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-3.5 py-1 rounded-full font-label-bold text-xs font-bold">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-headline-md text-2xl font-bold text-primary">
                        {item.title}
                      </h3>
                      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                      <span className="flex items-center gap-1.5 text-xs text-outline font-bold">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        {item.meta}
                      </span>
                      <button
                        onClick={() => setActiveModule(item.title)}
                        className="text-primary font-label-bold text-sm font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {item.linkText} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            // Normal Cards (4-column grid item)
            return (
              <article
                key={item.id}
                className="md:col-span-4 glass-panel rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-white/50 group hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-tertiary-container/30 text-on-tertiary-container px-3 py-1 rounded-full font-label-bold text-xs font-bold">
                      {item.category}
                    </div>
                    <span className="material-symbols-outlined text-primary bg-primary-container/40 p-2 rounded-full text-lg">
                      {item.type === "pdf" ? "gavel" : item.type === "audio" ? "psychology" : "videocam"}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-6 mt-4">
                  <button
                    onClick={() => setActiveModule(item.title)}
                    className="w-full bg-surface-container-high/80 text-on-surface hover:bg-primary hover:text-on-primary py-2.5 rounded-xl font-label-bold text-xs font-bold transition-all flex justify-center items-center gap-2 cursor-pointer border border-outline-variant/20 group-hover:border-primary"
                  >
                    <span className="material-symbols-outlined text-base">
                      {item.type === "pdf" ? "download" : item.type === "audio" ? "play_circle" : "ondemand_video"}
                    </span>
                    {item.linkText}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Active Module Success alert */}
      {activeModule && (
        <div className="fixed inset-0 z-[200] bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-2xl max-w-md w-full rounded-3xl p-8 border border-white/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-4xl">local_library</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-md text-xl font-bold text-primary">Now Launching Module</h3>
              <p className="text-sm font-semibold text-on-surface">{activeModule}</p>
              <p className="text-xs text-on-surface-variant">
                You are about to access legal guidance files or start a skill-building session. A secure connection is active.
              </p>
            </div>
            <button
              onClick={() => setActiveModule(null)}
              className="w-full bg-primary text-on-primary py-3 rounded-full font-label-bold text-sm font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-md shadow-primary/20"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* Create Program Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] bg-on-background/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/40 max-w-lg w-full rounded-3xl p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="font-headline-md text-lg font-bold text-on-surface">Create Safety Awareness Program</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="prog-title">
                  Program Title
                </label>
                <input
                  required
                  id="prog-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface"
                  placeholder="e.g. Self-Defense Camp 101"
                  type="text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="prog-cat">
                  Category
                </label>
                <select
                  id="prog-cat"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface cursor-pointer"
                >
                  <option value="Rules & Regulations">Rules & Regulations</option>
                  <option value="Awareness Programs">Awareness Programs</option>
                  <option value="Self-Employment">Self-Employment</option>
                  <option value="Confidence Building">Confidence Building</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="prog-meta">
                  Duration / Meta Info
                </label>
                <input
                  id="prog-meta"
                  value={newMeta}
                  onChange={(e) => setNewMeta(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface"
                  placeholder="e.g. 30 min read / 4 Video Lessons"
                  type="text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-bold text-xs font-bold text-on-surface block" htmlFor="prog-desc">
                  Short Description
                </label>
                <textarea
                  required
                  id="prog-desc"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface resize-none"
                  placeholder="Describe what this awareness program covers..."
                  rows={4}
                ></textarea>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 rounded-full font-label-bold text-xs font-bold text-on-surface bg-surface-container-high/80 hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full font-label-bold text-xs font-bold text-on-primary bg-primary hover:bg-primary/95 shadow transition-all cursor-pointer"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
