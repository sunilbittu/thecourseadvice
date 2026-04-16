"use client";

import { useState } from "react";
import Link from "next/link";
import { ContentCRMData, ContentPost } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import Counter from "@/components/counter";
import {
  FileText,
  PenLine,
  Eye,
  Archive,
  Plus,
  Search,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Clock,
  MoreHorizontal,
  Trash2,
  Send,
} from "lucide-react";

const statusConfig = {
  draft: { label: "Draft", bg: "bg-surface-container", text: "text-on-surface-variant" },
  review: { label: "In Review", bg: "bg-warning/10", text: "text-warning" },
  published: { label: "Published", bg: "bg-success/10", text: "text-success" },
  archived: { label: "Archived", bg: "bg-surface-container-high", text: "text-on-surface-variant" },
};

export default function ContentCRMClient({ data: initialData }: { data: ContentCRMData }) {
  const [data, setData] = useState(initialData);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredPosts = data.posts.filter((post) => {
    if (activeFilter !== "all" && post.status !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const updateStatus = async (postId: string, status: ContentPost["status"]) => {
    const res = await fetch(`/api/content/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => ({
        ...prev,
        posts: prev.posts.map((p) => (p.id === postId ? updated : p)),
        stats: {
          ...prev.stats,
          drafts: prev.posts.map((p) => (p.id === postId ? updated : p)).filter((p) => p.status === "draft").length,
          inReview: prev.posts.map((p) => (p.id === postId ? updated : p)).filter((p) => p.status === "review").length,
          published: prev.posts.map((p) => (p.id === postId ? updated : p)).filter((p) => p.status === "published").length,
          archived: prev.posts.map((p) => (p.id === postId ? updated : p)).filter((p) => p.status === "archived").length,
          total: prev.stats.total,
        },
      }));
    }
    setMenuOpenId(null);
  };

  const deletePost = async (postId: string) => {
    const res = await fetch(`/api/content/${postId}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => {
        const posts = prev.posts.filter((p) => p.id !== postId);
        return {
          ...prev,
          posts,
          stats: {
            total: posts.length,
            drafts: posts.filter((p) => p.status === "draft").length,
            inReview: posts.filter((p) => p.status === "review").length,
            published: posts.filter((p) => p.status === "published").length,
            archived: posts.filter((p) => p.status === "archived").length,
          },
        };
      });
    }
    setMenuOpenId(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="flex-1 page-enter">
      {/* Header */}
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto flex items-end justify-between">
          <div className="editorial-margins">
            <Link
              href="/institution"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
              Content Manager
            </h1>
            <p className="text-lg text-on-surface-variant">Create, manage, and publish your content.</p>
          </div>
          <Link
            href="/institution/content/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-tint text-white text-sm font-semibold hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>
      </section>

      <div className="px-8 py-10">
        <div className="max-w-[1440px] mx-auto">
          {/* KPI Stats */}
          <StaggerChildren className="grid grid-cols-5 gap-5 mb-10" stagger={0.06}>
            {[
              { icon: FileText, label: "Total", value: data.stats.total, color: "surface-tint" },
              { icon: PenLine, label: "Drafts", value: data.stats.drafts, color: "on-surface-variant", filter: "draft" },
              { icon: Clock, label: "In Review", value: data.stats.inReview, color: "warning", filter: "review" },
              { icon: Eye, label: "Published", value: data.stats.published, color: "success", filter: "published" },
              { icon: Archive, label: "Archived", value: data.stats.archived, color: "secondary", filter: "archived" },
            ].map((stat) => (
              <button
                key={stat.label}
                onClick={() => setActiveFilter("filter" in stat ? stat.filter! : "all")}
                className={`bg-white rounded-2xl p-6 ghost-border card-hover text-left transition-all ${
                  activeFilter === ("filter" in stat ? stat.filter : "all")
                    ? "ring-2 ring-surface-tint/30"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                  </div>
                  <p className="label-caps text-on-surface-variant text-[10px]">{stat.label}</p>
                </div>
                <p className="font-heading text-[2rem] font-extrabold text-on-surface leading-none">
                  <Counter value={stat.value} />
                </p>
              </button>
            ))}
          </StaggerChildren>

          {/* Search & Filter Bar */}
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search content by title, tags, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-xl pl-11 pr-5 py-3.5 text-sm text-on-surface ghost-border focus:border-surface-tint focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                {["all", "draft", "review", "published", "archived"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      activeFilter === filter
                        ? "bg-surface-tint text-white"
                        : "bg-white ghost-border text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {filter === "all" ? "All" : filter === "review" ? "In Review" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Content Table */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-2xl ghost-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low/40">
                    <th className="text-left px-7 py-3.5 label-caps text-on-surface-variant font-bold">Title</th>
                    <th className="text-left px-4 py-3.5 label-caps text-on-surface-variant font-bold">Category</th>
                    <th className="text-left px-4 py-3.5 label-caps text-on-surface-variant font-bold">Status</th>
                    <th className="text-left px-4 py-3.5 label-caps text-on-surface-variant font-bold">Author</th>
                    <th className="text-left px-4 py-3.5 label-caps text-on-surface-variant font-bold">Updated</th>
                    <th className="text-right px-7 py-3.5 label-caps text-on-surface-variant font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-7 py-16 text-center">
                        <FileText className="w-12 h-12 text-outline-variant/40 mx-auto mb-4" />
                        <p className="text-on-surface-variant font-medium">No content found</p>
                        <p className="text-sm text-on-surface-variant/60 mt-1">
                          {searchQuery
                            ? "Try adjusting your search or filters"
                            : "Create your first post to get started"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => {
                      const sc = statusConfig[post.status];
                      return (
                        <tr key={post.id} className="table-row-hover group border-t border-outline-variant/10">
                          <td className="px-7 py-5">
                            <Link
                              href={`/institution/content/${post.id}/edit`}
                              className="block group-hover:text-surface-tint transition-colors"
                            >
                              <p className="text-sm font-semibold text-on-surface group-hover:text-surface-tint transition-colors line-clamp-1">
                                {post.title}
                              </p>
                              <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{post.excerpt}</p>
                            </Link>
                          </td>
                          <td className="px-4 py-5">
                            <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-container-low text-on-surface-variant">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-4 py-5">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}
                            >
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
                                <span className="text-[9px] font-bold text-primary/40">
                                  {post.authorName
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")}
                                </span>
                              </div>
                              <span className="text-sm text-on-surface-variant">{post.authorName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-sm text-on-surface-variant">
                            {formatDate(post.updatedAt)}
                          </td>
                          <td className="px-7 py-5 text-right">
                            <div className="relative inline-block">
                              <button
                                onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                                className="p-2 rounded-lg hover:bg-surface-container-low transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4 text-on-surface-variant" />
                              </button>
                              {menuOpenId === post.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg ghost-border py-2 min-w-[180px] z-10">
                                  <Link
                                    href={`/institution/content/${post.id}/edit`}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                                  >
                                    <PenLine className="w-3.5 h-3.5" /> Edit
                                  </Link>
                                  {post.status === "draft" && (
                                    <button
                                      onClick={() => updateStatus(post.id, "review")}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                                    >
                                      <Send className="w-3.5 h-3.5" /> Submit for Review
                                    </button>
                                  )}
                                  {post.status === "review" && (
                                    <button
                                      onClick={() => updateStatus(post.id, "published")}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-success hover:bg-surface-container-low transition-colors"
                                    >
                                      <Eye className="w-3.5 h-3.5" /> Publish
                                    </button>
                                  )}
                                  {post.status === "published" && (
                                    <button
                                      onClick={() => updateStatus(post.id, "archived")}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                                    >
                                      <Archive className="w-3.5 h-3.5" /> Archive
                                    </button>
                                  )}
                                  {post.status === "archived" && (
                                    <button
                                      onClick={() => updateStatus(post.id, "draft")}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                                    >
                                      <PenLine className="w-3.5 h-3.5" /> Move to Draft
                                    </button>
                                  )}
                                  <div className="border-t border-outline-variant/10 my-1" />
                                  <button
                                    onClick={() => deletePost(post.id)}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
